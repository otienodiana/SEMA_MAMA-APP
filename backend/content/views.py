from django.shortcuts import render

from django.http import JsonResponse

def example_view(request):
    return JsonResponse({'message': 'Content API working!'})
