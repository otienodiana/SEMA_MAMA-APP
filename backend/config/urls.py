from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/mama/', include('mama.urls')),  # Make sure this is the first API path
    path('api/educational/', include('educational.urls')),
    path('api/appointments/', include('appointments.urls')),
]
