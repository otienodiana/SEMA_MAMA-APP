from django.urls import path
from .views import (
    RegisterUserView, get_users, custom_login, 
    ProtectedView, UserProfileView, get_user_role, get_moms
)
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('register/', RegisterUserView.as_view(), name='register'),
    path('login/', custom_login, name='login'),
    path('custom-login/', custom_login, name='custom_login'),
    path('me/', UserProfileView.as_view(), name='user_profile'),
    path('users/', get_users, name='list_users'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('protected/', ProtectedView.as_view(), name='protected_view'),
    path('user-role/', get_user_role, name='get_user_role'),
    path('moms/', get_moms, name='list_moms'),
]
