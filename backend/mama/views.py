from rest_framework import generics, permissions
from rest_framework.response import Response
from .models import Setting
from .serializers import SettingSerializer

class SettingDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = SettingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        # Get or create settings for the logged-in user
        setting, created = Setting.objects.get_or_create(user=self.request.user)
        return setting
