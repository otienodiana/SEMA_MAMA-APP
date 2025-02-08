from django.shortcuts import render

# Create your views here.
from django.http import JsonResponse

def example_sms_view(request):
    return JsonResponse({'message': 'SMS API is working!'})
