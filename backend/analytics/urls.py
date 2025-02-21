from django.urls import path
from .views import AnalyticsSummaryView, UserActivityView, ContentPerformanceView, SMSUsageView, ForumActivityView, ReportView

urlpatterns = [
    path('summary/', AnalyticsSummaryView.as_view(), name='analytics-summary'),
    path('user-activity/', UserActivityView.as_view(), name='user-activity'),
    path('content-performance/', ContentPerformanceView.as_view(), name='content-performance'),
    path('sms-usage/', SMSUsageView.as_view(), name='sms-usage'),
    path('forum-activity/', ForumActivityView.as_view(), name='forum-activity'),
    path('reports/', ReportView.as_view(), name='analytics-reports'),
]
