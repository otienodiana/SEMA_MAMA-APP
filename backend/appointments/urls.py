from django.urls import path
from .views import (
    MomAppointmentsView,
    UpdateAppointmentView,
    CancelAppointmentView,
    ProviderAppointmentsView,
    ApproveRejectAppointmentView,
    RescheduleAppointmentView,
    DeleteAppointmentView,
)

urlpatterns = [
    # ✅ List & Create Appointments for Moms
    path("moms/appointments/", MomAppointmentsView.as_view(), name="moms_appointments"),
    path('appointments/delete/<int:pk>/', DeleteAppointmentView.as_view(), name='delete-appointment'),

    # ✅ Update & Cancel Appointments (Only by the appointment owner)
    path("update/<int:pk>/", UpdateAppointmentView.as_view(), name="update_appointment"),
    path("cancel/<int:pk>/", CancelAppointmentView.as_view(), name="cancel_appointment"),

    # Providers: View & Manage Appointments
    path("providers/", ProviderAppointmentsView.as_view(), name="provider_appointments"),
    path("<int:pk>/approve/", ApproveRejectAppointmentView.as_view(), name="approve_appointment"),
    path("<int:pk>/reject/", ApproveRejectAppointmentView.as_view(), name="reject_appointment"),
    path("<int:pk>/reschedule/", RescheduleAppointmentView.as_view(), name="reschedule_appointment"),
]
