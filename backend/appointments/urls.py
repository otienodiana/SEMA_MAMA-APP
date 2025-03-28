from django.urls import path
from .views import (
    MomAppointmentsView,
    UpdateAppointmentView, 
    CancelAppointmentView,
    ProviderAppointmentsView,
    approve_appointment,
    reject_appointment,
    RescheduleAppointmentView,
    delete_appointment,
    HealthcareProvidersView
)

urlpatterns = [
    path('list/', MomAppointmentsView.as_view(), name='appointment-list-create'),  # This will handle both GET and POST
    path('provider/', ProviderAppointmentsView.as_view(), name='provider-appointments'),  # This will handle both GET and POST
    path('providers/', HealthcareProvidersView.as_view(), name='healthcare-providers'),
    path('update/<int:pk>/', UpdateAppointmentView.as_view(), name='update-appointment'),
    path('cancel/<int:pk>/', CancelAppointmentView.as_view(), name='cancel-appointment'),
    path('delete/<int:pk>/', delete_appointment, name='delete-appointment'),
    path('approve/<int:pk>/', approve_appointment, name='approve-appointment'),
    path('reject/<int:pk>/', reject_appointment, name='reject-appointment'),
    path('reschedule/<int:pk>/', RescheduleAppointmentView.as_view(), name='reschedule-appointment'),
]
