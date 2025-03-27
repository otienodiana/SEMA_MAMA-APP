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
    # Appointment list and create
    path('list/', MomAppointmentsView.as_view(), name='appointment-list'),
    path('create/', MomAppointmentsView.as_view(), name='appointment-create'),
    
    # Appointment actions
    path('update/<int:pk>/', UpdateAppointmentView.as_view(), name='update-appointment'),
    path('cancel/<int:pk>/', CancelAppointmentView.as_view(), name='cancel-appointment'),
    path('delete/<int:pk>/', delete_appointment, name='delete-appointment'),
    
    # Provider/Admin specific endpoints
    path('provider/approve/<int:pk>/', approve_appointment, name='approve-appointment'),
    path('provider/reject/<int:pk>/', reject_appointment, name='reject-appointment'),
    path('provider/reschedule/<int:pk>/', RescheduleAppointmentView.as_view(), name='reschedule-appointment'),
    path('provider/list/', ProviderAppointmentsView.as_view(), name='provider-appointments'),
]
