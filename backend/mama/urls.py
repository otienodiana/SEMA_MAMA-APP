from django.urls import path
from .views import SettingDetailView

urlpatterns = [
    path('settings/', SettingDetailView.as_view(), name='user-settings'),
]
