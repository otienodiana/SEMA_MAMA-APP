"""
URL configuration for sema_mama project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.http import JsonResponse
from django.urls import path,include

def home_view(request):
    return JsonResponse({"message": "Welcome to Sema Mama Backend!"})

urlpatterns = [
    path('', home_view),
    path('', include('mama.urls')),  # Serve home page from mama app
    path('admin/', admin.site.urls),
    path('api/', include('mama.urls')),
    path('api/users/', include('users.urls')),  # Authentication, Profiles
    path('api/content/', include('content.urls')),  # Educational content
    path('api/support/', include('support.urls')),  # Postpartum Support, Forums
    path('api/sms/', include('sms.urls')),  # SMS-based Support
    path('api/analytics/', include('analytics.urls')),  # User engagement tracking
    path('api/appointments/', include('appointments.urls')), #for appointments
]
