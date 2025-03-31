from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ContentViewSet, 
    ContentUploadView, 
    ContentListCreateView, 
    ContentDetailView,
    ManageContentView
)

app_name = 'content'

urlpatterns = [
    path('contents/', ContentListCreateView.as_view(), name='content-list'),
    path('contents/<int:pk>/', ContentDetailView.as_view(), name='content-detail'),
    path('contents/upload/', ContentUploadView.as_view(), name='content-upload'),
    path('contents/manage/<int:content_id>/', ManageContentView.as_view(), name='manage-content'),
]
