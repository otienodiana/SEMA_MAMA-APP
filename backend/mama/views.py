from rest_framework import generics, permissions, status, viewsets
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth import get_user_model
from django.db.models import Q
from django.conf import settings
from .models import Setting, PostpartumDepressionQuestion, AssessmentResponse, AssessmentResult, DailyLog, ChatMessage, Forum
from .serializers import SettingSerializer, QuestionSerializer, AssessmentResultSerializer, DailyLogSerializer, ProviderSerializer, ChatMessageSerializer, ForumSerializer
import logging

logger = logging.getLogger(__name__)

User = get_user_model()  # Add this line at top level

class UserSettingsView(generics.RetrieveUpdateAPIView):
    """
    View for retrieving and updating user settings
    Handles both GET and PUT/PATCH requests
    """
    serializer_class = SettingSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return Setting.objects.get_or_create(user=self.request.user)[0]

class AssessmentQuestionsView(generics.ListAPIView):
    """View for listing active assessment questions"""
    queryset = PostpartumDepressionQuestion.objects.filter(is_active=True)
    serializer_class = QuestionSerializer
    permission_classes = [IsAuthenticated]

class SubmitAssessmentView(generics.CreateAPIView):
    """View for submitting assessment responses and getting results"""
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        responses_data = request.data.get('responses', {})
        total_score = sum(responses_data.values())
        
        # Create AssessmentResult
        result = AssessmentResult.objects.create(
            user=request.user,
            total_score=total_score
        )

        # Create individual responses
        for question_id, response_value in responses_data.items():
            AssessmentResponse.objects.create(
                user=request.user,
                question_id=question_id,
                response=response_value
            )

        result.calculate_risk_level()
        result.save()

        return Response({
            'total_score': result.total_score,
            'risk_level': result.risk_level,
            'notes': result.notes
        }, status=status.HTTP_201_CREATED)

class AssessmentQuestionList(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = QuestionSerializer
    
    def get_queryset(self):
        return PostpartumDepressionQuestion.objects.filter(is_active=True).order_by('order')

    def list(self, request, *args, **kwargs):
        try:
            queryset = self.get_queryset()
            if not queryset.exists():
                return Response(
                    {'message': 'No assessment questions available'}, 
                    status=404
                )
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response(
                {'message': f'Error fetching questions: {str(e)}'}, 
                status=500
            )

class DailyLogViewSet(viewsets.ModelViewSet):
    queryset = DailyLog.objects.all()
    serializer_class = DailyLogSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        logger.debug(f"User {self.request.user.id} requesting daily logs")
        try:
            return DailyLog.objects.filter(user=self.request.user).order_by('-created_at')
        except Exception as e:
            logger.error(f"Error in get_queryset: {str(e)}")
            return DailyLog.objects.none()

    def perform_create(self, serializer):
        logger.debug(f"Creating daily log for user {self.request.user.id}")
        try:
            serializer.save(user=self.request.user)
        except Exception as e:
            logger.error(f"Error in perform_create: {str(e)}")
            raise

    def create(self, request, *args, **kwargs):
        logger.debug(f"Create request data: {request.data}")
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(
                serializer.data, 
                status=status.HTTP_201_CREATED, 
                headers=headers
            )
        except Exception as e:
            logger.error(f"Error in create: {str(e)}")
            return Response(
                {"detail": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

def home(request):
    infos = Info.objects.all()
    return render(request, 'mama/home.html', {'infos': infos})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def provider_list(request):
    """Get list of healthcare providers"""
    try:
        providers = User.objects.filter(role='healthcare_provider')
        
        # Debug logging
        logger.info(f"Fetching providers. Total found: {providers.count()}")
        for provider in providers:
            logger.info(f"Provider found - ID: {provider.id}, Email: {provider.email}")
        
        if not providers.exists():
            return Response([], status=status.HTTP_200_OK)
            
        serializer = ProviderSerializer(providers, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.exception(f"Error in provider_list: {str(e)}")
        return Response(
            {"error": f"Failed to fetch providers: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def chat_history(request, other_user_id=None):
    try:
        logger.debug("\n=== Chat History Request Started ===")
        logger.debug(f"User: {request.user.id}")
        logger.debug(f"Other user ID: {other_user_id}")

        try:
            # Base query with related fields
            base_query = ChatMessage.objects.select_related('sender', 'recipient')

            if other_user_id:
                # Convert to int and validate
                other_user_id = int(other_user_id)
                base_query = base_query.filter(
                    Q(sender_id=request.user.id, recipient_id=other_user_id) |
                    Q(sender_id=other_user_id, recipient_id=request.user.id)
                )
            else:
                # Get all messages for user
                base_query = base_query.filter(
                    Q(sender_id=request.user.id) | Q(recipient_id=request.user.id)
                )

            # Order by timestamp
            messages = base_query.order_by('timestamp')
            
            # Log message count
            logger.debug(f"Found {messages.count()} messages")

            # Serialize messages
            serializer = ChatMessageSerializer(messages, many=True)
            
            # Mark messages as read
            unread_messages = messages.filter(
                recipient_id=request.user.id, 
                is_read=False
            )
            if unread_messages.exists():
                unread_messages.update(is_read=True)

            logger.debug("=== Chat History Request Completed ===")
            return Response(serializer.data)

        except ValueError:
            return Response(
                {"error": "Invalid user ID format"},
                status=status.HTTP_400_BAD_REQUEST
            )
            
    except Exception as e:
        logger.exception("Error in chat_history:")
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_message(request):
    try:
        logger.debug("=== Send Message Request ===")
        logger.debug(f"User: {request.user.email}")
        logger.debug(f"Request data: {request.data}")

        recipient_id = request.data.get('recipient_id')
        content = request.data.get('content', '').strip()

        if not content or not recipient_id:
            return Response(
                {"error": "Message content and recipient_id are required"}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Get recipient user
        try:
            recipient = User.objects.get(id=recipient_id)
        except User.DoesNotExist:
            return Response(
                {"error": "Recipient not found"}, 
                status=status.HTTP_404_NOT_FOUND
            )

        # Create and save message
        message = ChatMessage.objects.create(
            sender=request.user,
            recipient=recipient,
            content=content
        )

        # Serialize and return
        serializer = ChatMessageSerializer(message)
        logger.debug(f"Created message: {serializer.data}")
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    except Exception as e:
        logger.exception("Error in send_message")
        return Response(
            {"error": str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_chat_users(request):
    """Get all users available for chat"""
    try:
        # Verify token and user authentication
        if not request.user.is_authenticated:
            return Response(
                {'detail': 'Authentication required'}, 
                status=status.HTTP_401_UNAUTHORIZED
            )

        print(f"Fetching chat users for: {request.user.email} (role: {request.user.role})")
        
        # Get current user's role
        current_user = request.user
        
        # Filter users based on role
        if current_user.role == 'healthcare_provider':
            users = User.objects.filter(role__in=['mom', 'admin'])  # Include both moms and admins
        elif current_user.role == 'mom':
            users = User.objects.filter(role__in=['healthcare_provider', 'admin'])
        else:
            users = User.objects.exclude(id=current_user.id)
        
        # Process user data
        user_list = [{
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'role': user.role,
            'profile_photo_url': request.build_absolute_uri(settings.MEDIA_URL + str(user.profile_photo)) if user.profile_photo else None,
            'first_name': user.first_name or '',
            'last_name': user.last_name or '',
        } for user in users]

        return Response(user_list, status=status.HTTP_200_OK)

    except Exception as e:
        print(f"Error in get_chat_users: {str(e)}")
        return Response(
            {'detail': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([AllowAny])  # Allow unauthenticated access
def public_forums(request):
    """Get list of public forums without authentication"""
    try:
        forums = Forum.objects.filter(
            visibility='public'
        ).order_by('-created_at')[:3]  # Get latest 3 public forums
        
        serializer = ForumSerializer(forums, many=True, context={'request': request})
        return Response(serializer.data)
    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )