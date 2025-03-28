from django.urls import path
from .views import (
    SubmitContentView,
    PendingContentListView,
    ApproveContentView,
    RejectContentView,
    ListContentView,
    DeleteContentView,  # Add this import
    MultimediaContentView,  # Add this import
)

urlpatterns = [
    path('submit/', SubmitContentView.as_view(), name='submit-content'),
    path('content/list/', ListContentView.as_view(), name='list-content'),  # Add this line
    path('content/pending/', PendingContentListView.as_view(), name='pending-content'),
    path('content/approve/<int:pk>/', ApproveContentView.as_view(), name='approve-content'),
    path('content/reject/<int:pk>/', RejectContentView.as_view(), name='reject-content'),
    path('content/<int:pk>/', DeleteContentView.as_view(), name='delete-content'),  # Add this line
    path('multimedia/', MultimediaContentView.as_view(), name='multimedia-content'),
]