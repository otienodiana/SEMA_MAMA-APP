from django.urls import path
from .views import CreateAppointmentView, ListAppointmentsView, UpdateAppointmentView, CancelAppointmentView

urlpatterns = [
    path('create/', CreateAppointmentView.as_view(), name='create_appointment'),
    path('list/', ListAppointmentsView.as_view(), name='list_appointments'),
    path('update/<int:pk>/', UpdateAppointmentView.as_view(), name='update_appointment'),
    path('cancel/<int:pk>/', CancelAppointmentView.as_view(), name='cancel_appointment'),
]
