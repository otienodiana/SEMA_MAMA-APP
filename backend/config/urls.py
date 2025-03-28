from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    # ...existing paths...
    path('api/educational/', include('educational.urls')),
    path('api/appointments/', include('appointments.urls')),
]
