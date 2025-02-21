from rest_framework import generics, permissions
from .models import SMSMessage
from .serializers import SMSMessageSerializer

class SendSMSView(generics.CreateAPIView):
    queryset = SMSMessage.objects.all()
    serializer_class = SMSMessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user, status='sent')

class SMSHistoryView(generics.ListAPIView):
    serializer_class = SMSMessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return SMSMessage.objects.filter(sender=self.request.user)
