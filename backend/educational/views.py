from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from .models import EducationalContent
from .serializers import EducationalContentSerializer
from rest_framework.exceptions import PermissionDenied
from django.db.models import Q
from django.utils import timezone

class SubmitContentView(generics.CreateAPIView):
    queryset = EducationalContent.objects.all()
    serializer_class = EducationalContentSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, *args, **kwargs):
        try:
            # Print request data for debugging
            print("Request FILES:", request.FILES)
            print("Request DATA:", request.data)

            serializer = self.serializer_class(data=request.data)
            if serializer.is_valid():
                serializer.save(
                    created_by=request.user,
                    status='pending'
                )
                return Response(
                    serializer.data, 
                    status=status.HTTP_201_CREATED
                )
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            print("Error:", str(e))  # Debug print
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

class PendingContentListView(generics.ListAPIView):
    serializer_class = EducationalContentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Return pending content if user is admin"""
        if self.request.user.role == 'admin':
            return EducationalContent.objects.filter(status='pending').order_by('-created_at')
        return EducationalContent.objects.none()

class ApproveContentView(generics.UpdateAPIView):
    queryset = EducationalContent.objects.all()
    serializer_class = EducationalContentSerializer
    permission_classes = [IsAuthenticated]

    def patch(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            if request.user.role != 'admin':
                raise PermissionDenied("Only admins can approve content")
            
            instance.status = 'approved'
            instance.approved_by = request.user
            instance.approved_at = timezone.now()
            instance.save()

            serializer = self.get_serializer(instance)
            return Response({
                'status': 'success',
                'message': 'Content approved successfully',
                'data': serializer.data
            })
        except Exception as e:
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)

class RejectContentView(generics.UpdateAPIView):
    """View to reject educational content"""
    queryset = EducationalContent.objects.all()
    serializer_class = EducationalContentSerializer
    permission_classes = [IsAuthenticated]

    def perform_update(self, serializer):
        if self.request.user.role != 'admin':
            raise PermissionDenied("Only admins can reject content")
        
        rejection_reason = self.request.data.get('rejection_reason')
        if not rejection_reason:
            raise serializers.ValidationError("Rejection reason is required")
            
        serializer.save(
            status='rejected',
            rejection_reason=rejection_reason
        )

class ListContentView(generics.ListAPIView):
    """View to list all educational content"""
    serializer_class = EducationalContentSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]  # Add this line

    def get_queryset(self):
        """Return all content for admins, or provider's own content plus approved content"""
        user = self.request.user
        if user.role == 'admin':
            return EducationalContent.objects.all()
        elif user.role == 'healthcare_provider':
            return EducationalContent.objects.filter(
                Q(created_by=user) |  # Provider's own content
                Q(status='approved')   # Approved content
            ).order_by('-created_at')
        else:
            return EducationalContent.objects.filter(status='approved')
            
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

class DeleteContentView(generics.DestroyAPIView):
    queryset = EducationalContent.objects.all()
    serializer_class = EducationalContentSerializer
    permission_classes = [IsAuthenticated]

    def destroy(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            # Check if user is creator or admin
            if request.user == instance.created_by or request.user.role == 'admin':
                self.perform_destroy(instance)
                return Response(
                    {"message": "Content deleted successfully"},
                    status=status.HTTP_204_NO_CONTENT
                )
            else:
                return Response(
                    {"error": "You don't have permission to delete this content"},
                    status=status.HTTP_403_FORBIDDEN
                )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )