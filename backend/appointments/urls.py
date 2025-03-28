from django.urls import path
from .views import (
    MomAppointmentsView,
    UpdateAppointmentView, 
    CancelAppointmentView,
    ProviderAppointmentsView,
    approve_appointment,
    reject_appointment,
    RescheduleAppointmentView,
    delete_appointment
)

urlpatterns = [
    # List and create appointments
    path('list/', MomAppointmentsView.as_view(), name='appointment-list'),
    path('create/', MomAppointmentsView.as_view(), name='appointment-create'),
    
    # Provider specific endpoints
    path('provider/', ProviderAppointmentsView.as_view(), name='provider-appointments'),  # Changed from providers/ to provider/
    
    # Appointment actions
    path('update/<int:pk>/', UpdateAppointmentView.as_view(), name='update-appointment'),
    path('cancel/<int:pk>/', CancelAppointmentView.as_view(), name='cancel-appointment'),
    path('delete/<int:pk>/', delete_appointment, name='delete-appointment'),  # Fixed delete endpoint
    path('approve/<int:pk>/', approve_appointment, name='approve-appointment'),  # Fixed approve endpoint
    path('reject/<int:pk>/', reject_appointment, name='reject-appointment'),
    path('reschedule/<int:pk>/', RescheduleAppointmentView.as_view(), name='reschedule-appointment'),
]
