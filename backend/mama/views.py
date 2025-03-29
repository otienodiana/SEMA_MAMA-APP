from rest_framework import generics, permissions, status, viewsets
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth import get_user_model
from django.db.models import Q
from .models import Setting, PostpartumDepressionQuestion, AssessmentResponse, AssessmentResult, DailyLog, ChatMessage
from .serializers import SettingSerializer, QuestionSerializer, AssessmentResultSerializer, DailyLogSerializer, ProviderSerializer, ChatMessageSerializer
import logging

logger = logging.getLogger(__name__)

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
    serializer_class = DailyLogSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return DailyLog.objects.filter(user=self.request.user).order_by('-created_at')

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

def home(request):
    infos = Info.objects.all()
    return render(request, 'mama/home.html', {'infos': infos})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def provider_list(request):
    """Get list of healthcare providers"""
    try:
        User = get_user_model()
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
        User = get_user_model()
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
def chat_users_list(request):
    """Get list of mom users who have chatted with the provider"""
    try:
        logger.debug(f"Fetching chats for provider: {request.user.email}")
        
        # Check if user is a healthcare provider
        if request.user.role != 'healthcare_provider':
            return Response(
                {"error": "Only healthcare providers can access this endpoint"},
                status=status.HTTP_403_FORBIDDEN
            )

        # Get all users with role 'mom' who have sent messages to this provider
        User = get_user_model()
        mom_users = User.objects.filter(role='mom')
        
        logger.debug(f"Found {mom_users.count()} mom users")

        # Get messages for each mom
        user_dict = {}
        for mom in mom_users:
            # Check if there are any messages between this mom and the provider
            messages = ChatMessage.objects.filter(
                (Q(sender=mom, recipient=request.user) |
                 Q(sender=request.user, recipient=mom))
            ).order_by('-timestamp')

            if messages.exists():  # Only include moms with messages
                latest_message = messages.first()
                unread_count = messages.filter(
                    sender=mom,
                    recipient=request.user,
                    is_read=False
                ).count()

                user_dict[mom.id] = {
                    'id': mom.id,
                    'first_name': mom.first_name,
                    'last_name': mom.last_name,
                    'email': mom.email,
                    'unread_count': unread_count,
                    'last_message': latest_message.content,
                    'last_message_time': latest_message.timestamp.isoformat()
                }

        users = list(user_dict.values())
        # Sort by unread messages and then by latest message time
        users.sort(key=lambda x: (-x['unread_count'], x['last_message_time']), reverse=True)
        
        logger.debug(f"Returning {len(users)} mom users with chat history")
        logger.debug(f"User details: {users}")
        
        return Response(users)
        
    except Exception as e:
        logger.exception("Error in chat_users_list")
        return Response(
            {"error": str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )