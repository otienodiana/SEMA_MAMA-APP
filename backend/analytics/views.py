from rest_framework import generics, permissions
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from django.db import models
from django.utils.timezone import now, timedelta
import logging
import traceback

logger = logging.getLogger(__name__)

from .models import UserActivity, ContentPerformance, SMSUsage, ForumActivity, Report
from .serializers import (
    UserActivitySerializer, 
    ContentPerformanceSerializer, 
    SMSUsageSerializer, 
    ForumActivitySerializer, 
    ReportSerializer
)

User = get_user_model()

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from django.core.cache import cache
from django.db.models import Count, Q
from django.db import transaction
from users.models import User
from appointments.models import Appointment
from content.models import Content
from community.models import Forum, Post, Comment

class AnalyticsSummaryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            # Basic error checking
            if not request.user.is_authenticated:
                return Response({"error": "Authentication required"}, status=401)

            # Get user statistics
            user_stats = {
                'total_users': User.objects.count(),
                'active_users': User.objects.filter(
                    last_login__gte=timezone.now() - timezone.timedelta(days=30)
                ).count(),
                'inactive_users': User.objects.filter(
                    Q(last_login__lt=timezone.now() - timezone.timedelta(days=30)) |
                    Q(last_login__isnull=True)
                ).count(),
                'user_growth': self.get_user_growth_data()
            }

            # Get engagement metrics
            engagement_metrics = {
                'total_appointments': Appointment.objects.count() if 'Appointment' in globals() else 0,
                'total_posts': Post.objects.count() if 'Post' in globals() else 0,
                'total_comments': Comment.objects.count() if 'Comment' in globals() else 0,
                'engagement_trends': self.get_engagement_trends()
            }

            data = {
                'user_statistics': user_stats,
                'engagement_metrics': engagement_metrics
            }

            return Response(data)

        except Exception as e:
            import traceback
            print(f"Analytics Error: {str(e)}\n{traceback.format_exc()}")
            return Response({"error": str(e)}, status=500)

    def get_user_growth_data(self):
        """Get monthly user growth data for the past 6 months"""
        months = []
        counts = []
        for i in range(5, -1, -1):  # Last 6 months
            date = timezone.now() - timezone.timedelta(days=i*30)
            count = User.objects.filter(date_joined__lte=date).count()
            months.append(date.strftime('%b'))
            counts.append(count)
        return counts  # Return just the counts, labels handled on frontend

    def get_engagement_trends(self):
        """Get current engagement metrics"""
        return [
            Post.objects.count() if 'Post' in globals() else 0,
            Comment.objects.count() if 'Comment' in globals() else 0,
            Post.objects.aggregate(total_likes=models.Sum('likes'))['total_likes'] or 0,
            Post.objects.aggregate(total_shares=models.Sum('shares'))['total_shares'] or 0,
        ]

    def get_server_uptime(self):
        # Implementation for server uptime
        pass

    def get_realtime_activity(self):
        return {
            'online_users': cache.get('online_users', 0),
            'recent_activities': cache.get('recent_activities', [])
        }

class AnalyticsDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            recent_users = list(User.objects.all().order_by('-date_joined')[:5].values(
                'id', 'username', 'email', 'role', 'date_joined'
            ))
            
            recent_appointments = list(Appointment.objects.all().order_by('-created_at')[:5].values(
                'id', 'user_id', 'provider_id', 'date', 'status',
                'title', 'description', 'consultation_type'
            ))
            
            popular_content = list(Content.objects.all().order_by('-created_at')[:5].values(
                'id', 'title', 'content_type', 'created_at'
            ))
            
            active_forums = list(Forum.objects.all().order_by('-created_at')[:5].values(
                'id', 'name', 'created_at'
            ))

            # Add user details to appointments
            for appointment in recent_appointments:
                user = User.objects.get(id=appointment['user_id'])
                provider = User.objects.get(id=appointment['provider_id'])
                appointment['user_name'] = user.username
                appointment['provider_name'] = provider.username

            data = {
                'recent_users': recent_users,
                'recent_appointments': recent_appointments,
                'popular_content': popular_content,
                'active_forums': active_forums
            }
            return Response(data, status=200)
        except Exception as e:
            print(f"Analytics Error: {str(e)}")
            return Response({'error': str(e)}, status=500)

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
