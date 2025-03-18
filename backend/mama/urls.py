from django.urls import path
from . import views

app_name = 'mama'

urlpatterns = [
    path('assessment/questions/', views.AssessmentQuestionsView.as_view(), name='questions'),
    path('assessment/submit/', views.SubmitAssessmentView.as_view(), name='submit'),
    path('settings/', views.UserSettingsView.as_view(), name='settings'),
]
