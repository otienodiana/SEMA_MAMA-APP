from django.contrib.auth import get_user_model, authenticate
from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import UserSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.views import APIView

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]  # Only logged-in users can access this

    def get(self, request):
        user = request.user  # Get the logged-in user
        serializer = UserSerializer(user)
        return Response(serializer.data)

User = get_user_model()

# Register a new user (Allow any user to register)
class RegisterUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

#  Login API (JWT Authentication)
class LoginView(TokenObtainPairView):
    """Handles user login and returns JWT tokens"""
    permission_classes = [AllowAny]

# Alternative custom login function
@api_view(['POST'])
@permission_classes([AllowAny])
def custom_login(request):
    """Custom login method returning JWT tokens"""
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(username=username, password=password)
    if user:
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_200_OK)
    
    return Response({'error': 'Invalid Credentials'}, status=status.HTTP_401_UNAUTHORIZED)

#  Retrieve all users (Requires authentication)
@api_view(['GET'])
@permission_classes([IsAuthenticated])  # Protect this API
def get_users(request):
    """Fetch all registered users (Requires Authentication)"""
    users = User.objects.all()  
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

# Refresh token API (Optional)
class RefreshTokenView(TokenRefreshView):
    """Handles refreshing JWT tokens"""
    permission_classes = [AllowAny]

#  Protected API Endpoint
class ProtectedView(APIView):
    """Example of an endpoint that requires authentication"""
    permission_classes = [IsAuthenticated]  # Ensures only authenticated users can access

    def get(self, request):
        return Response({"message": "You are authorized!"})
