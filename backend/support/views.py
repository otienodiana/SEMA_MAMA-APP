from django.shortcuts import render

# Create your views here.
from django.http import JsonResponse

def example_support_view(request):
    return JsonResponse({'message': 'Support API is working!'})
