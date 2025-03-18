from django.contrib import admin
from django.http import JsonResponse
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

def home_view(request):
    return JsonResponse({"message": "Welcome to Sema Mama Backend!"})

urlpatterns = [
    path('', home_view),  # Root home response
    path('admin/', admin.site.urls),

    # API endpoints
    path('api/mama/', include('mama.urls')),  # Changed from 'api/'
    path('api/users/', include('users.urls')),  # Authentication, Profiles
    path('api/content/', include('content.urls')),  # Educational content
    path('api/community/', include('community.urls')),  # Postpartum Support, Forums
    
    path('api/analytics/', include('analytics.urls')),  # User engagement tracking
    path('api/appointments/', include('appointments.urls')),  # Appointments
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)