from django.urls import path
from .views import ContentViewSet, ContentUploadView, ContentListView
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'content-viewset', ContentViewSet, basename='content-viewset')

urlpatterns = [
    path('contents/', ContentListView.as_view(), name='content-list'),
    path('upload/', ContentUploadView.as_view(), name='content-upload'),
] + router.urls
