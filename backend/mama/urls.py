from django.urls import path
from . import views

app_name = 'mama'

urlpatterns = [
    path('assessment/questions/', views.AssessmentQuestionList.as_view(), name='assessment-questions'),
    path('assessment/submit/', views.SubmitAssessment.as_view(), name='submit-assessment'),
    path('settings/', views.UserSettingsView.as_view(), name='settings'),
]
