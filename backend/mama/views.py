from django.http import HttpResponse

def home(request):
    return HttpResponse("<h1>Welcome to Sema Mama API</h1><p>checking backend endpoints</p>")
