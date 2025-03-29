from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import HttpResponse

def home(request):
    return HttpResponse("Welcome to the Sema Mama API!")

urlpatterns = [
    path("", home),
    path('admin/', admin.site.urls),
    path('api/mama/', include('mama.urls')),
    path('api/users/', include('users.urls')),
    path('api/content/', include('content.urls')),
    path('api/appointments/', include('appointments.urls')),
    path('api/community/', include('community.urls')),
    path('api/analytics/', include('analytics.urls')),
    path('api/educational/', include('educational.urls')),
]

if settings.DEBUG:
    urlpatterns += [
        path('__debug__/', include('debug_toolbar.urls')),
    ]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# Update the static file serving for development
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)