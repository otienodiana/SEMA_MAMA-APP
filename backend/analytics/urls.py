from django.urls import path
from .views import (
    AnalyticsSummaryView,
    AnalyticsDetailView,
    analytics_detail
)

urlpatterns = [
    path('summary/', AnalyticsSummaryView.as_view(), name='analytics_summary'),
    path('detail/', analytics_detail, name='analytics_detail'),
]
