from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

app_name = 'mama'

router = DefaultRouter()
router.register('daily-logs', views.DailyLogViewSet, basename='daily-log')

urlpatterns = [
    path('', include(router.urls)),
    path('assessment/questions/', views.AssessmentQuestionList.as_view(), name='assessment-questions'),
    path('assessment/submit/', views.SubmitAssessmentView.as_view(), name='submit-assessment'),
    path('settings/', views.UserSettingsView.as_view(), name='settings'),
    path('providers/', views.provider_list, name='provider-list'),
    path('chat/history/', views.chat_history, name='chat-history'),
    path('chat/history/<int:other_user_id>/', views.chat_history, name='chat-history-with-user'),
    path('chat/send/', views.send_message, name='send-message'),
    path('chats/users/', views.chat_users_list, name='chat-users-list'),
]
