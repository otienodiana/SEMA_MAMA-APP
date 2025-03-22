from django.urls import path
from .views import (
    MomAppointmentsView,
    UpdateAppointmentView,
    CancelAppointmentView,
    ProviderAppointmentsView,
    ApproveRejectAppointmentView,
    RescheduleAppointmentView,
    DeleteAppointmentView
)

urlpatterns = [
    # Mom-specific Routes
    path("moms/appointments/", MomAppointmentsView.as_view(), name="mom_appointments_list"),
    path("moms/appointments/create/", MomAppointmentsView.as_view(), name="mom_create_appointment"),
    
    # Appointment Management
    path("update/<int:pk>/", UpdateAppointmentView.as_view(), name="update_appointment"),
    path("cancel/<int:pk>/", CancelAppointmentView.as_view(), name="cancel_appointment"),
    path("delete/<int:pk>/", DeleteAppointmentView.as_view(), name="delete_appointment"),

    # Provider Routes
    path("provider/list/", ProviderAppointmentsView.as_view(), name="provider_appointments"),
    path("provider/approve/<int:pk>/", ApproveRejectAppointmentView.as_view(), name="approve_appointment"),
    path("provider/reject/<int:pk>/", ApproveRejectAppointmentView.as_view(), name="reject_appointment"),
    path("provider/reschedule/<int:pk>/", RescheduleAppointmentView.as_view(), name="reschedule_appointment"),

    # General list route - use MomAppointmentsView for general listing
    path('list/', MomAppointmentsView.as_view(), name='appointment-list'),
]
