from rest_framework import generics, permissions
from rest_framework.response import Response
from django.utils.timezone import now
from .models import UserActivity, ContentPerformance, SMSUsage, ForumActivity, Report
from .serializers import (
    UserActivitySerializer, 
    ContentPerformanceSerializer, 
    SMSUsageSerializer, 
    ForumActivitySerializer, 
    ReportSerializer
)

class AnalyticsSummaryView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        return Response({
            "user_activities": UserActivity.objects.filter(user=user).count(),
            "content_performance": ContentPerformance.objects.count(),
            "sms_usage": SMSUsage.objects.filter(user=user).count(),
            "forum_activity": ForumActivity.objects.filter(user=user).count(),
        })

class UserActivityView(generics.ListAPIView):
    queryset = UserActivity.objects.all()
    serializer_class = UserActivitySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return UserActivity.objects.filter(user=self.request.user)

class ContentPerformanceView(generics.ListAPIView):
    queryset = ContentPerformance.objects.all()
    serializer_class = ContentPerformanceSerializer
    permission_classes = [permissions.IsAuthenticated]

class SMSUsageView(generics.ListAPIView):
    queryset = SMSUsage.objects.all()
    serializer_class = SMSUsageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return SMSUsage.objects.filter(user=self.request.user)

class ForumActivityView(generics.ListAPIView):
    queryset = ForumActivity.objects.all()
    serializer_class = ForumActivitySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ForumActivity.objects.filter(user=self.request.user)

class ReportView(generics.ListCreateAPIView):
    queryset = Report.objects.all()
    serializer_class = ReportSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user, created_at=now())
