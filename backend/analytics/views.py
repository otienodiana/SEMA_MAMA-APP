from django.shortcuts import render

# Create your views here.
from django.http import JsonResponse

def example_analytics_view(request):
    return JsonResponse({'message': 'Analytics API is working!'})
