from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    RegisterUserView, CustomTokenObtainPairView, UserProfileView,
    get_users, get_moms, get_user_permissions,
    delete_user, update_role, list_moms
)

app_name = 'users'

urlpatterns = [
    path('register', RegisterUserView.as_view(), name='register'),  # Remove trailing slash
    path('login/', CustomTokenObtainPairView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('me/', UserProfileView.as_view(), name='profile'),
    path('users/', get_users, name='users'),
    path('all/', get_users, name='all-users'),
    path('moms/', get_moms, name='moms'),
    path('my-permissions/', get_user_permissions, name='permissions'),
    path('delete/<int:user_id>/', delete_user, name='delete_user'),
    path('update-role/<int:user_id>/', update_role, name='update_role'),
    path('list/moms/', list_moms, name='list_moms'),
]
