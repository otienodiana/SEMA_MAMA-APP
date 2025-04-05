from django.contrib.auth import get_user_model, authenticate
from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated  # Fixed import syntax
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.views import APIView
from django.http import JsonResponse
from .serializers import UserSerializer
from appointments.models import Appointment
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.generics import UpdateAPIView
from rest_framework.response import Response
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model
from rest_framework.generics import RetrieveUpdateAPIView
from appointments.serializers import AppointmentSerializer
from .permissions import require_permission, HasRolePermission
from .models import User, Role  # Add Role import
from django.utils import timezone
from django.db.models import Count
from community.models import Post, Comment
from django.conf import settings


User = get_user_model()

# Profile API (GET, UPDATE, DELETE)
class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]  
    parser_classes = (MultiPartParser, FormParser)  # Allow handling file uploads

    def get(self, request):
        """Retrieve user profile"""
        try:
            user = request.user
            print(f"Fetching profile for user: {user.id}") # Debug log
            
            serializer = UserSerializer(user, context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)
            
        except Exception as e:
            print(f"Profile fetch error: {str(e)}") # Debug log
            return Response(
                {"detail": str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def put(self, request):
        """Update user profile (including profile picture)"""
        serializer = UserSerializer(
            request.user, 
            data=request.data, 
            context={'request': request},
            partial=True
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        """Delete user profile"""
        user = request.user
        user.delete()
        return Response({"message": "Profile deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
#  User Registration
class RegisterUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
    parser_classes = (MultiPartParser, FormParser)

    def create(self, request, *args, **kwargs):
        try:
            # Log the incoming request data
            print("Registration request data:", request.data)
            print("Files:", request.FILES)

            serializer = self.get_serializer(data=request.data)
            
            if not serializer.is_valid():
                print("Validation errors:", serializer.errors)  # Add logging
                return Response(
                    serializer.errors,
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            user = serializer.save()
            return Response({
                "detail": "Registration successful",
                "user": UserSerializer(user, context={'request': request}).data
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            print(f"Registration error: {str(e)}")
            return Response(
                {"detail": str(e)}, 
                status=status.HTTP_400_BAD_REQUEST
            )

# JWT Login
class LoginView(TokenObtainPairView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        try:
            response = super().post(request, *args, **kwargs)
            if response.status_code == 200:
                user = request.user
                response.data['user'] = {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'role': user.role,
                }
            return response
        except Exception as e:
            return Response(
                {"detail": str(e)},
                status=status.HTTP_401_UNAUTHORIZED
            )

#  Alternative Custom Login (returns JWT)
@api_view(["POST"])
@permission_classes([AllowAny])
def custom_login(request):
    """Custom login view that handles both regular and admin login"""
    username = request.data.get("username", "").strip()
    password = request.data.get("password", "").strip()
    is_admin_login = request.data.get("is_admin_login", False)  # New parameter
    
    if not username or not password:
        return Response(
            {"detail": "Both username and password are required"},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        user = User.objects.get(username=username)
        
        # For admin login route, verify user is admin
        if is_admin_login and user.role != 'admin':
            return Response(
                {"detail": "This login is for administrators only"},
                status=status.HTTP_403_FORBIDDEN
            )
            
        # Authenticate user
        user = authenticate(username=username, password=password)
        if user and user.is_active:
            refresh = RefreshToken.for_user(user)
            return Response({
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "role": user.role,
                    "profile_photo": user.profile_photo.url if user.profile_photo else None,
                },
                "redirect": '/dashboard/admin' if user.role == 'admin' else f'/dashboard/{user.role}'
            })
        else:
            return Response(
                {"detail": "Invalid credentials"},
                status=status.HTTP_401_UNAUTHORIZED
            )
            
    except User.DoesNotExist:
        return Response(
            {"detail": "User not found"},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        print(f"Login error: {str(e)}")
        return Response(
            {"detail": "An error occurred during login"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


#  Get all users (admin only)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_users(request):
    """Get all users based on role filter"""
    try:
        role = request.query_params.get('role', None)
        users = User.objects.all()
        
        if role:
            users = users.filter(role=role)
            
        serialized_users = [{
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'role': user.role,
            'first_name': user.first_name,
            'last_name': user.last_name,
        } for user in users]
        
        return Response({
            'users': serialized_users
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

#  Refresh Token API
class RefreshTokenView(TokenRefreshView):
    permission_classes = [AllowAny]

#  Example Protected API
class ProtectedView(APIView):
    permission_classes = [IsAuthenticated]  

    def get(self, request):
        return Response({"message": "You are authorized!"})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_user_role(request):
    """Retrieve the role of the authenticated user"""
    user = request.user  # Get the logged-in user
    return Response({"role": user.role}, status=200)  # ✅ Use `user.role`



class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Customize JWT response to include user data"""
    def validate(self, attrs):
        data = super().validate(attrs)
        user = self.user

        if not user:
            raise serializers.ValidationError("Invalid username or password.")

        # Ensure user role exists
        user_role = getattr(user, "role", None)
        if user_role is None:
            raise serializers.ValidationError("User role not found.")

        data["user"] = {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "role": user_role,  # Make sure 'role' exists
        }
        return data

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        try:
            response = super().post(request, *args, **kwargs)
            if response.status_code == 200:
                # Get user from the serializer instead of self
                serializer = self.get_serializer(data=request.data)
                serializer.is_valid(raise_exception=True)
                user = serializer.user
                
                response.data['user'] = {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'role': user.role,
                    'profile_photo': user.profile_photo.url if user.profile_photo else None,
                }
            return response
        except Exception as e:
            return Response(
                {"detail": str(e)},
                status=status.HTTP_401_UNAUTHORIZED
            )


from rest_framework.parsers import MultiPartParser, FormParser

class UserProfileUpdateView(RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)  # ✅ Enable file uploads

    def get_object(self):
        return self.request.user  # ✅ Ensure only the logged-in user is updated
    


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_moms(request):
    """Allow only healthcare providers & admins to view moms"""
    try:
        if request.user.role not in ["healthcare_provider", "admin"]:
            return Response(
                {"detail": "You do not have permission to view this resource."}, 
                status=status.HTTP_403_FORBIDDEN
            )

        # Get all users with the role "mom" and debug
        moms = User.objects.filter(role="mom")
        print(f"Found {moms.count()} mom users")  # Debug print
        
        mom_data = [{
            'id': mom.id,
            'username': mom.username,
            'email': mom.email,
            'first_name': mom.first_name or '',
            'last_name': mom.last_name or '',
            'role': mom.role
        } for mom in moms]
        
        return Response(mom_data, status=status.HTTP_200_OK)
        
    except Exception as e:
        print(f"Error fetching moms: {str(e)}")
        return Response(
            {"detail": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(["GET"])
@permission_classes([IsAuthenticated])  # ✅ Protect the endpoint
def list_appointments(request):
    """List all appointments for the logged-in healthcare provider"""
    user = request.user

    if user.role != "healthcare_provider":
        return Response({"error": "Only healthcare providers can access this."}, status=403)

    appointments = Appointment.objects.filter(healthcare_provider=user)
    serializer = AppointmentSerializer(appointments, many=True)

    return Response(serializer.data, status=200)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@require_permission('assign_roles')
def assign_role(request, user_id):
    try:
        user = User.objects.get(id=user_id)
        new_role = request.data.get('role')
        
        if new_role not in dict(User.ROLE_CHOICES):
            return Response(
                {'error': 'Invalid role'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        user.role = new_role
        user.save()
        
        return Response({
            'message': f'Role updated to {new_role}',
            'permissions': user.get_permissions()
        })
    except User.DoesNotExist:
        return Response(
            {'error': 'User not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_permissions(request):
    """Get user permissions and role"""
    try:
        user = request.user
        permissions = []
        
        # Add permissions based on role
        if user.role == 'admin':
            permissions = [
                'manage_users',
                'view_content',
                'manage_content',
                'manage_forums',
                'manage_appointments',
                'assign_roles'
            ]
        elif user.role == 'healthcare_provider':
            permissions = [
                'view_content',
                'manage_appointments',
                'view_forums'
            ]
            
        return Response({
            'role': user.role,
            'permissions': permissions
        })
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_user(request, user_id):
    """Delete a user (admin only)"""
    try:
        if request.user.role != 'admin':
            return Response(
                {"detail": "Only administrators can delete users"},
                status=status.HTTP_403_FORBIDDEN
            )

        user = User.objects.get(id=user_id)
        user.delete()
        return Response(
            {"detail": "User deleted successfully"},
            status=status.HTTP_200_OK
        )
    except User.DoesNotExist:
        return Response(
            {"detail": "User not found"},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {"detail": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def assign_role(request, user_id):
    """Assign a new role to a user (admin only)"""
    try:
        if request.user.role != 'admin':
            return Response(
                {"detail": "Only administrators can assign roles"},
                status=status.HTTP_403_FORBIDDEN
            )

        user = User.objects.get(id=user_id)
        new_role = request.data.get('role')
        
        if new_role not in ['admin', 'healthcare_provider', 'mom']:
            return Response(
                {"detail": "Invalid role"},
                status=status.HTTP_400_BAD_REQUEST
            )

        user.role = new_role
        user.save()
        
        return Response({
            "detail": f"Role updated to {new_role}",
            "user": UserSerializer(user).data
        })
    except User.DoesNotExist:
        return Response(
            {"detail": "User not found"},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {"detail": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_role(request, user_id):
    """Update user role (admin only)"""
    try:
        # Verify admin permission
        if request.user.role != 'admin':
            return Response(
                {"detail": "Only administrators can update roles"},
                status=status.HTTP_403_FORBIDDEN
            )

        # Get user and new role
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response(
                {"detail": "User not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        new_role = request.data.get('role')
        if not new_role:
            return Response(
                {"detail": "Role is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Validate role
        valid_roles = ['admin', 'healthcare_provider', 'mom']
        if new_role not in valid_roles:
            return Response(
                {"detail": f"Invalid role. Must be one of: {', '.join(valid_roles)}"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Update user role
        user.role = new_role
        user.save()

        # Return updated user data
        serializer = UserSerializer(user, context={'request': request})
        return Response({
            "detail": "Role updated successfully",
            "user": serializer.data
        }, status=status.HTTP_200_OK)

    except Exception as e:
        print(f"Role update error: {str(e)}")  # Debug log
        return Response(
            {"detail": "Failed to update role"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_role(request):
    """Create a new role (admin only)"""
    try:
        # Verify admin permission
        if request.user.role != 'admin':
            return Response(
                {"detail": "Only administrators can create roles"},
                status=status.HTTP_403_FORBIDDEN
            )

        # Get and validate role data
        name = request.data.get('name')
        permissions = request.data.get('permissions', [])

        if not name:
            return Response(
                {"detail": "Role name is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check if role already exists
        if Role.objects.filter(name=name).exists():
            return Response(
                {"detail": f"Role '{name}' already exists"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Create new role
        role = Role.objects.create(
            name=name,
            permissions=permissions
        )

        return Response({
            "detail": "Role created successfully",
            "role": {
                "id": role.id,
                "name": role.name,
                "permissions": role.permissions,
                "created_at": role.created_at
            }
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        print(f"Role creation error: {str(e)}")  # Debug log
        return Response(
            {"detail": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_roles(request):
    """List all available roles (admin only)"""
    try:
        if request.user.role != 'admin':
            return Response(
                {"detail": "Only administrators can view roles"},
                status=status.HTTP_403_FORBIDDEN
            )

        # Get all roles from the Role model
        roles = Role.objects.all()
        roles_data = [
            {
                "id": role.id,
                "name": role.name,
                "permissions": role.permissions,
                "created_at": role.created_at
            }
            for role in roles
        ]

        return Response({
            "roles": roles_data
        }, status=status.HTTP_200_OK)

    except Exception as e:
        print(f"Error listing roles: {str(e)}")  # Debug log
        return Response(
            {"detail": "Failed to fetch roles"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_role(request, role_id):
    """Delete a custom role (admin only)"""
    try:
        if request.user.role != 'admin':
            return Response(
                {"detail": "Only administrators can delete roles"},
                status=status.HTTP_403_FORBIDDEN
            )

        role = Role.objects.get(id=role_id)
        
        # Prevent deletion of default roles
        default_roles = ['admin', 'healthcare_provider', 'mom']
        if role.name in default_roles:
            return Response(
                {"detail": "Cannot delete default roles"},
                status=status.HTTP_400_BAD_REQUEST
            )

        role.delete()
        return Response(
            {"detail": "Role deleted successfully"},
            status=status.HTTP_200_OK
        )
    except Role.DoesNotExist:
        return Response(
            {"detail": "Role not found"},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {"detail": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_users(request):
    """Get all users (admin only)"""
    try:
        if request.user.role != 'admin':
            return Response(
                {"error": "Only administrators can view all users"}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        users = User.objects.all()
        serializer = UserSerializer(users, many=True, context={'request': request})
        
        # Return array of users directly
        return Response(serializer.data)
        
    except Exception as e:
        print(f"Error in get_all_users: {str(e)}")
        return Response(
            {"error": f"Failed to fetch users: {str(e)}"}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_analytics(request):
    """Get analytics data for the dashboard"""
    try:
        # Get user statistics
        total_users = User.objects.count()
        active_users = User.objects.filter(last_login__gte=timezone.now() - timezone.timedelta(days=30)).count()
        
        # Get appointment statistics
        total_appointments = Appointment.objects.count()
        
        # Get forum engagement statistics
        total_posts = Post.objects.count()
        total_comments = Comment.objects.count()
        
        return Response({
            'user_statistics': {
                'total_users': total_users,
                'active_users': active_users,
                'inactive_users': total_users - active_users,
                'user_growth': [0, 0, 0, 0, 0, 0]  # Placeholder for growth data
            },
            'engagement_metrics': {
                'total_appointments': total_appointments,
                'total_posts': total_posts,
                'total_comments': total_comments,
                'engagement_trends': [total_posts, total_comments, 0, 0]
            }
        })
    except Exception as e:
        print(f"Analytics error: {str(e)}")
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_moms(request):
    """List all mom users for provider chat"""
    try:
        print(f"Fetching moms for provider: {request.user.email}")  # Debug log
        
        # Verify the requester is a healthcare provider
        if request.user.role != 'healthcare_provider':
            return Response(
                {'detail': 'Only healthcare providers can access this endpoint'},
                status=status.HTTP_403_FORBIDDEN
            )

        # Fetch mom users with all necessary fields
        moms = User.objects.filter(role='mom').values(
            'id', 
            'username', 
            'email',
            'first_name',
            'last_name',
            'profile_photo',
            'last_login',
            'phone_number'
        )
        
        print(f"Found {len(moms)} mom users")  # Debug log
        
        # Process each mom's data
        mom_list = []
        for mom in moms:
            mom_data = {
                'id': mom['id'],
                'username': mom['username'],
                'email': mom['email'],
                'name': f"{mom['first_name']} {mom['last_name']}".strip() or mom['username'],
                'phone_number': mom.get('phone_number', ''),
                'profile_photo_url': None
            }
            
            # Add profile photo URL if exists
            if mom['profile_photo']:
                mom_data['profile_photo_url'] = request.build_absolute_uri(
                    settings.MEDIA_URL + str(mom['profile_photo'])
                )
                
            mom_list.append(mom_data)

        print(f"Returning {len(mom_list)} processed mom records")  # Debug log
        return Response(mom_list, status=status.HTTP_200_OK)
        
    except Exception as e:
        print(f"Error in list_moms: {str(e)}")  # Debug log
        return Response(
            {'detail': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view

@api_view(['POST'])
def register_user(request):
    try:
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                "message": "Registration successful",
                "user": UserSerializer(user).data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response(
            {"error": str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )