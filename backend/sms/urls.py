from django.urls import path
from . import views

urlpatterns = [
    path('', views.example_sms_view, name='example-sms'),
]
