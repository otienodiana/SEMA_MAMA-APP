from django.urls import path
from .views import ContentListCreateView, ContentDetailView

urlpatterns = [
    path('contents/', ContentListCreateView.as_view(), name='content-list-create'),
    path('contents/<int:pk>/', ContentDetailView.as_view(), name='content-detail'),
]
