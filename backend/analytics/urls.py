from django.urls import path
from .views import (
    AnalyticsSummaryView,
    AnalyticsDetailView,
    analytics_detail
)

app_name = 'analytics'  # Add this line

urlpatterns = [
    path('summary/', AnalyticsSummaryView.as_view(), name='analytics_summary'),
    path('detail/', analytics_detail, name='analytics_detail'),
    path('', analytics_detail, name='analytics'),  # Add default route
]
