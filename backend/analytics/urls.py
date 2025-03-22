from django.urls import path
from .views import AnalyticsSummaryView, AnalyticsDetailView

urlpatterns = [
    path('summary/', AnalyticsSummaryView.as_view(), name='analytics-summary'),
    path('detail/', AnalyticsDetailView.as_view(), name='analytics-detail'),
]
