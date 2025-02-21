from rest_framework import serializers
from .models import Setting

class SettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Setting
        fields = ['language', 'dark_mode', 'notifications', 'privacy', 'timezone', 'content_preferences']
