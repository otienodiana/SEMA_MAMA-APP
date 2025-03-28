from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .models import Appointment
from .serializers import AppointmentSerializer
from rest_framework.views import APIView
from rest_framework.authentication import TokenAuthentication
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.auth import get_user_model
from rest_framework.exceptions import ValidationError

User = get_user_model()

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

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def perform_create(self, serializer):
        """Save appointment with mom as user and selected provider"""
        provider_id = self.request.data.get('provider')
        provider = None
        if provider_id:
            try:
                provider = User.objects.get(id=provider_id, role='healthcare_provider')
            except User.DoesNotExist:
                raise ValidationError("Selected healthcare provider does not exist")
        
        # Explicitly set both user and provider
        serializer.save(
            user=self.request.user,
            provider=provider,
            status='pending'
        )
        print("Created appointment:", serializer.data)  # Debug log
        
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
class ProviderAppointmentsView(generics.ListCreateAPIView):
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Fetch appointments for the logged-in provider"""
        user = self.request.user
        if user.role != 'healthcare_provider':
            return Appointment.objects.none()
        return Appointment.objects.filter(provider=user)

    def perform_create(self, serializer):
        """Save the appointment with the provider set to current user"""
        user_id = self.request.data.get('user')
        user_email = self.request.data.get('user_email')
        
        try:
            mom = User.objects.get(id=user_id, role='mom')
            if not user_email:
                user_email = mom.email
            
            print(f"Creating appointment with mom: {mom.email}, user_email: {user_email}")  # Debug log
            
            appointment = serializer.save(
                provider=self.request.user,
                status='pending',
                user=mom,
                user_email=user_email
            )
            print(f"Created appointment: {appointment.user_email}")  # Debug log
            
        except User.DoesNotExist:
            raise ValidationError("Selected user must be a registered mom")
        except Exception as e:
            raise ValidationError(f"Error creating appointment: {str(e)}")

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        appointments = list(queryset)
        
        # Debug log
        for app in appointments:
            print(f"Appointment {app.id} user_email: {app.user_email}")
        
        serializer = self.get_serializer(appointments, many=True)
        data = serializer.data
        
        # Add user details to each appointment
        for appointment in data:
            try:
                mom = User.objects.get(id=appointment['user'])
                appointment['user_details'] = {
                    'id': mom.id,
                    'email': mom.email,
                    'first_name': mom.first_name,
                    'last_name': mom.last_name
                }
                # Ensure user_email is set
                if not appointment.get('user_email'):
                    appointment['user_email'] = mom.email
            except User.DoesNotExist:
                appointment['user_details'] = None
                
        return Response(data)


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


class HealthcareProvidersView(generics.ListAPIView):
    """View to list all healthcare providers"""
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        providers = User.objects.filter(role='healthcare_provider')
        print(f"DEBUG: Found {providers.count()} healthcare providers")
        if providers.exists():
            print("DEBUG: Provider List:", [
                {
                    'id': p.id,
                    'name': f"{p.first_name} {p.last_name}",
                    'email': p.email
                } for p in providers
            ])
        else:
            print("DEBUG: No healthcare providers found in database. Available roles:", 
                  User.objects.values_list('role', flat=True).distinct())
        return providers

    def list(self, request, *args, **kwargs):
        providers = self.get_queryset()
        data = [{
            'id': provider.id,
            'first_name': provider.first_name,
            'last_name': provider.last_name,
            'email': provider.email,
            'role': provider.role
        } for provider in providers]
        
        # Return empty list with 200 status instead of 404
        return Response(data, status=status.HTTP_200_OK)
