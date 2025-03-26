from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ContentViewSet, ContentUploadView

router = DefaultRouter()
router.register(r'contents', ContentViewSet, basename='content')

urlpatterns = [
    path('contents/upload/', ContentUploadView.as_view(), name='content-upload'),
    path('', include(router.urls)),
]
