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
    path('api/users/', include('users.urls', namespace='users')),
    path('api/appointments/', include('appointments.urls', namespace='appointments')),
    path('api/content/', include('content.urls', namespace='content')),
    path('api/educational/', include('educational.urls')),
    path('api/community/', include('community.urls')),
    path('api/mama/', include('mama.urls', namespace='mama')),
    path('api/analytics/', include('analytics.urls', namespace='analytics')),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

if settings.DEBUG:
    urlpatterns += [
        path('__debug__/', include('debug_toolbar.urls')),
    ]