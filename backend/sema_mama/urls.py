from django.contrib import admin
from django.http import JsonResponse
from django.urls import path, include

def home_view(request):
    return JsonResponse({"message": "Welcome to Sema Mama Backend!"})

urlpatterns = [
    path('', home_view),  # Root home response
    path('admin/', admin.site.urls),

    # API endpoints
    path('api/', include('mama.urls')),  # General API routes
    path('api/users/', include('users.urls')),  # Authentication, Profiles
    path('api/content/', include('content.urls')),  # Educational content
    path('api/support/', include('support.urls')),  # Postpartum Support, Forums
    path('api/sms/', include('sms.urls')),  # SMS-based Support
    path('api/analytics/', include('analytics.urls')),  # User engagement tracking
    path('api/appointments/', include('appointments.urls')),  # Appointments
]
