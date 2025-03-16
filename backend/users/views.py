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
from appointments.models import Appointment
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.generics import UpdateAPIView
from rest_framework.response import Response
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model
from rest_framework.generics import RetrieveUpdateAPIView
from appointments.serializers import AppointmentSerializer



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

    print(f"🔍 Debug: Username: {username}, Password: {password}")  # Debugging

    user = authenticate(username=username, password=password)
    
    if user:
        refresh = RefreshToken.for_user(user)
        response_data = {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "user": {  
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "role": user.role,  
                "phone_number": user.phone_number,
                "age": user.age,
            }
        }
        print("✅ Backend Response:", response_data)  # Debugging
        return Response(response_data, status=status.HTTP_200_OK)

    print("⚠️ Invalid credentials")
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

    print("Current User Role:", request.user.role)  # ✅ Debugging Step

    if request.user.role not in ["healthcare_provider", "admin"]:
        return Response(
            {"detail": "You do not have permission to view this resource."}, 
            status=status.HTTP_403_FORBIDDEN
        )

    moms = User.objects.filter(role="mom")
    print("Moms Found:", moms)  # ✅ Debugging Step

    serializer = UserSerializer(moms, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)



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