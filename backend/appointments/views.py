from rest_framework import generics, permissions
from .models import Appointment
from .serializers import AppointmentSerializer

class CreateAppointmentView(generics.CreateAPIView):
    """Users can create a new appointment."""
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ListAppointmentsView(generics.ListAPIView):
    """Users can view their own appointments."""
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Appointment.objects.filter(user=self.request.user).order_by('date')

class UpdateAppointmentView(generics.UpdateAPIView):
    """Users can update an appointment (e.g., reschedule)."""
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Appointment.objects.filter(user=self.request.user, status='scheduled')

class CancelAppointmentView(generics.UpdateAPIView):
    """Users can cancel an appointment."""
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Appointment.objects.filter(user=self.request.user, status='scheduled')

    def perform_update(self, serializer):
        serializer.save(status='canceled')
