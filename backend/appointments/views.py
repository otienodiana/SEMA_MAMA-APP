from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .models import Appointment
from .serializers import AppointmentSerializer
from rest_framework.views import APIView
from rest_framework.authentication import TokenAuthentication
from rest_framework_simplejwt.authentication import JWTAuthentication


class MomAppointmentsView(generics.ListCreateAPIView):
    """View to list and create appointments for mothers"""
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]  # Add explicit JWT authentication

    def get_queryset(self):
        """Fetch only the logged-in mom's appointments"""
        user = self.request.user
        if user.role == 'mom':
            return Appointment.objects.filter(user=user)
        elif user.role in ['healthcare_provider', 'admin']:
            return Appointment.objects.all()
        return Appointment.objects.none()

    def perform_create(self, serializer):
        """Ensure the logged-in mom is assigned to the appointment"""
        serializer.save(user=self.request.user)
        
    def create(self, request, *args, **kwargs):
        """Override create to handle validation errors gracefully"""
        try:
            return super().create(request, *args, **kwargs)
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

class UpdateAppointmentView(generics.UpdateAPIView):
    """Allow moms to update their own appointments"""
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def update(self, request, *args, **kwargs):
        appointment = self.get_object()
        if appointment.user != request.user:
            return Response({"error": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)
        return super().update(request, *args, **kwargs)

class CancelAppointmentView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request, pk):
        try:
            appointment = Appointment.objects.get(pk=pk)

            # ✅ Moms can only cancel their own appointments
            # ✅ Healthcare providers can cancel any appointment
            if request.user == appointment.user or request.user.role == "healthcare_provider":
                appointment.status = "canceled"
                appointment.save()
                return Response({"message": "Appointment canceled successfully"}, status=status.HTTP_200_OK)
            
            return Response({"error": "You are not authorized to cancel this appointment"}, status=status.HTTP_403_FORBIDDEN)
        
        except Appointment.DoesNotExist:
            return Response({"error": "Appointment not found"}, status=status.HTTP_404_NOT_FOUND)


#  NEW: View all appointments (for providers)
class ProviderAppointmentsView(generics.ListAPIView):
    """Providers can see only their assigned appointments and pending ones"""
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Fetch both pending and assigned appointments for the provider"""
        return Appointment.objects.filter(
            provider=self.request.user
        ) | Appointment.objects.filter(status="pending")



#  NEW: Approve or Reject an appointment
class ApproveRejectAppointmentView(generics.UpdateAPIView):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]  # Ensure user is authenticated

    def update(self, request, *args, **kwargs):
        appointment = self.get_object()
        new_status = request.data.get("status")

        if new_status not in ["approved", "rejected"]:
            return Response({"error": "Invalid status"}, status=status.HTTP_400_BAD_REQUEST)

        appointment.status = new_status

        if new_status == "approved":
            appointment.save()
            return Response({"message": "Appointment approved successfully"}, status=status.HTTP_200_OK)

        elif new_status == "rejected":
            rejection_reason = request.data.get("rejection_reason")
            if not rejection_reason:
                return Response({"error": "Rejection reason required"}, status=status.HTTP_400_BAD_REQUEST)
            appointment.rejection_reason = rejection_reason
            appointment.save()
            return Response({"message": "Appointment rejected successfully"}, status=status.HTTP_200_OK)

        return Response({"error": "Something went wrong"}, status=status.HTTP_400_BAD_REQUEST)



# 🚀 NEW: Reschedule an appointment
class RescheduleAppointmentView(generics.UpdateAPIView):
    """Providers can reschedule an appointment"""
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def update(self, request, *args, **kwargs):
        appointment = self.get_object()
        new_date = request.data.get("date")

        if not new_date:
            return Response({"error": "New date is required"}, status=status.HTTP_400_BAD_REQUEST)

        appointment.date = new_date
        appointment.rescheduled_at = new_date
        appointment.status = "scheduled"
        appointment.save()
        return Response(AppointmentSerializer(appointment).data)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def approve_appointment(request, pk):
    """Approve an appointment."""
    try:
        # Only admin and healthcare providers can approve appointments
        if request.user.role not in ['admin', 'healthcare_provider']:
            return Response(
                {"error": "Only administrators and healthcare providers can approve appointments"}, 
                status=status.HTTP_403_FORBIDDEN
            )

        appointment = Appointment.objects.get(pk=pk)
        appointment.status = "approved"
        appointment.save()
        
        serializer = AppointmentSerializer(appointment)
        return Response(serializer.data, status=status.HTTP_200_OK)
        
    except Appointment.DoesNotExist:
        return Response(
            {"error": "Appointment not found"}, 
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {"error": str(e)}, 
            status=status.HTTP_400_BAD_REQUEST
        )

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def reject_appointment(request, pk):
    """Reject an appointment with a reason."""
    try:
        if request.user.role not in ['admin', 'healthcare_provider']:
            return Response(
                {"error": "Only administrators and healthcare providers can reject appointments"}, 
                status=status.HTTP_403_FORBIDDEN
            )

        appointment = Appointment.objects.get(pk=pk)
        rejection_reason = request.data.get('rejection_reason', 'No reason provided')
        
        appointment.status = "rejected"
        appointment.rejection_reason = rejection_reason
        appointment.save()
        
        serializer = AppointmentSerializer(appointment)
        return Response(serializer.data, status=status.HTTP_200_OK)
        
    except Appointment.DoesNotExist:
        return Response(
            {"error": "Appointment not found"}, 
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {"error": str(e)}, 
            status=status.HTTP_400_BAD_REQUEST
        )

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def cancel_appointment(request, pk):
    """Cancel an appointment if the user is authorized."""
    try:
        appointment = Appointment.objects.get(pk=pk)

        # ✅ Moms can cancel their own appointments
        # ✅ Healthcare providers can cancel any appointment
        if request.user == appointment.user or request.user.role == "healthcare_provider":
            appointment.status = "canceled"
            appointment.save()
            return Response({"message": "Appointment canceled successfully"}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)

    except Appointment.DoesNotExist:
        return Response({"error": "Appointment not found"}, status=status.HTTP_404_NOT_FOUND)


class DeleteAppointmentView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, pk):
        try:
            appointment = Appointment.objects.get(pk=pk)

            # ✅ Moms can only delete their own appointments
            # ✅ Providers (or Admins) can delete any appointment
            if request.user == appointment.user or request.user.role in ["healthcare_provider", "admin"]:
                appointment.delete()
                return Response({"message": "Appointment deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
            
            return Response({"error": "You are not authorized to delete this appointment"}, status=status.HTTP_403_FORBIDDEN)
        
        except Appointment.DoesNotExist:
            return Response({"error": "Appointment not found"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_appointment(request, pk):
    """Delete an appointment if the user is authorized."""
    try:
        appointment = Appointment.objects.get(pk=pk)

        #  Moms can only delete their own appointments
        #  Providers (or Admins) can delete any appointment
        if request.user == appointment.user or request.user.role in ["healthcare_provider", "admin"]:
            appointment.delete()
            return Response({"message": "Appointment deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({"error": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)

    except Appointment.DoesNotExist:
        return Response({"error": "Appointment not found"}, status=status.HTTP_404_NOT_FOUND)
