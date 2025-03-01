from django.urls import path
from .views import ContentListCreateView, ContentDetailView,ContentUploadView,ContentDeleteView

urlpatterns = [
    path('contents/', ContentListCreateView.as_view(), name='content-list-create'),
    path('contents/<int:pk>/', ContentDetailView.as_view(), name='content-detail'),
    path('contents/upload/', ContentUploadView.as_view(), name='content-upload'),
    path("contents/<int:pk>/delete/", ContentDeleteView.as_view(), name="content-delete"), 
]
