from django.urls import path
from .views import SendSMSView, SMSHistoryView

urlpatterns = [
    path('send/', SendSMSView.as_view(), name='send_sms'),
    path('history/', SMSHistoryView.as_view(), name='sms_history'),
]
