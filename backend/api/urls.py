from django.urls import path, include

urlpatterns = [
    path('users/', include('users.urls')),
    path('content/', include('content.urls')),
    path('support/', include('support.urls')),
    path('sms/', include('sms.urls')),
    path('analytics/', include('analytics.urls')),
]
