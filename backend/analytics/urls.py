from django.urls import path
from . import views

urlpatterns = [
    path('', views.example_analytics_view, name='example-analytics'),
]
