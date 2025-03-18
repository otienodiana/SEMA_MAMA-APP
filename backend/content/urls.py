from django.urls import path
from . import views

urlpatterns = [
    path('contents/', views.ContentListView.as_view(), name='contents-list'),
    path('contents/upload/', views.ContentUploadView.as_view(), name='content-upload'),
    path('contents/<int:pk>/', views.ContentDetailView.as_view(), name='content-detail'),
]
