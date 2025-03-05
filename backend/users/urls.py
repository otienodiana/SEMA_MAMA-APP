from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import RegisterUserView, get_users, LoginView, custom_login, ProtectedView, UserProfileView, get_user_role # Add the user role API
from .views import CustomTokenObtainPairView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('register/', RegisterUserView.as_view(), name='register'),  # User Registration
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('custom-login/', custom_login, name='custom_login'),  # Alternative login
    path('me/', UserProfileView.as_view(), name='user_profile'),  #  Profile API
    path('users/', get_users, name='list_users'),  #  Get All Users (Protected)
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),  # Refresh Token
    path('protected/', ProtectedView.as_view(), name='protected_view'),  # Example protected endpoint
    path("user-role/", get_user_role, name="get_user_role"),  # Add the user role API
]
