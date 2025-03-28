from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Setting, PostpartumDepressionQuestion, AssessmentResponse, AssessmentResult
from .serializers import SettingSerializer, QuestionSerializer, AssessmentResultSerializer

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
