from django.urls import path
from .views import (
    RegisterUserView, get_users, custom_login, 
    ProtectedView, UserProfileView, get_user_role, get_moms,
    get_user_permissions, delete_user, assign_role, update_role,
    create_role, list_roles, delete_role, get_all_users, get_analytics  # Make sure delete_role, get_all_users, and get_analytics are imported
)
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('register/', RegisterUserView.as_view(), name='register'),
    path('login/', custom_login, name='login'),  # This will handle both regular and admin login
    path('me/', UserProfileView.as_view(), name='user_profile'),
    path('users/', get_users, name='user_list'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('user-role/', get_user_role, name='get_user_role'),
    path('moms/', get_moms, name='list_moms'),
    path('my-permissions/', get_user_permissions, name='my_permissions'),
    path('delete/<int:user_id>/', delete_user, name='delete_user'),
    path('assign-role/<int:user_id>/', update_role, name='update_role'),
    path('roles/create/', create_role, name='create_role'),
    path('roles/', list_roles, name='list_roles'),
    path('roles/<int:role_id>/', update_role, name='update_role'),
    path('roles/<int:role_id>/delete/', delete_role, name='delete_role'),
    path('all/', get_all_users, name='get-all-users'),
    path('analytics/', get_analytics, name='user-analytics'),
]
