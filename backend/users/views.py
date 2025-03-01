from django.contrib.auth import get_user_model, authenticate
from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.views import APIView
from django.http import JsonResponse
from .serializers import UserSerializer
from rest_framework.parsers import MultiPartParser, FormParser


User = get_user_model()

# Profile API (GET, UPDATE, DELETE)
class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]  
    parser_classes = (MultiPartParser, FormParser)  # Allow handling file uploads

    def get(self, request):
        """Retrieve user profile"""
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    def put(self, request):
        """Update user profile (including profile picture)"""
        serializer = UserSerializer(request.user, data=request.data, partial=True)
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

# JWT Login
class LoginView(TokenObtainPairView):
    permission_classes = [AllowAny]

#  Alternative Custom Login (returns JWT)
@api_view(["POST"])
@permission_classes([AllowAny])
def custom_login(request):
    username = request.data.get("username")
    password = request.data.get("password")

    user = authenticate(username=username, password=password)
    if user:
        refresh = RefreshToken.for_user(user)
        return Response({
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email
            }
        }, status=status.HTTP_200_OK)

    return Response({"error": "Invalid Credentials"}, status=status.HTTP_401_UNAUTHORIZED)


#  Get all users (Protected)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_users(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

#  Refresh Token API
class RefreshTokenView(TokenRefreshView):
    permission_classes = [AllowAny]

#  Example Protected API
class ProtectedView(APIView):
    permission_classes = [IsAuthenticated]  

    def get(self, request):
        return Response({"message": "You are authorized!"})
