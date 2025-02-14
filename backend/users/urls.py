from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import RegisterUserView, get_users,LoginView, custom_login,ProtectedView,UserProfileView


urlpatterns = [
    path('register/', RegisterUserView.as_view(), name='register'),  # User Registration
    path('login/', LoginView.as_view(), name='token_obtain_pair'),  # Default JWT Login
    path('custom-login/', custom_login, name='custom_login'),  # Alternative login
    path('me/', UserProfileView.as_view(), name='user_profile'),
    path('users/', get_users, name='list_users'),  # Fetch Users (Protected)
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),  # Refresh Token
    path('protected/', ProtectedView.as_view(), name='protected_view'),
]
