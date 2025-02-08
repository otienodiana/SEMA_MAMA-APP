from django.urls import path
from . import views

urlpatterns = [
    path('', views.example_support_view, name='example-support'),
]
