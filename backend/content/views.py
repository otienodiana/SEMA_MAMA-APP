from rest_framework import generics, permissions, viewsets
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from .models import Content
from .serializers import ContentSerializer
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.generics import RetrieveUpdateDestroyAPIView
from django.core.exceptions import ValidationError
from rest_framework.exceptions import ParseError
import mimetypes
import os
from django.db import transaction
from django.utils import timezone
from rest_framework.decorators import action

class IsHealthcareProvider(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.role in ['healthcare_provider', 'admin']

class ContentListView(generics.ListAPIView):
    serializer_class = ContentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        try:
            return Content.objects.all().order_by('-created_at')
        except Exception as e:
            print(f"Error fetching content: {str(e)}")
            return Content.objects.none()

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def list(self, request, *args, **kwargs):
        try:
            queryset = self.get_queryset()
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)
        except Exception as e:
            print(f"Error in list view: {str(e)}")
            return Response(
                {"error": "Failed to fetch content"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class ContentUploadView(generics.CreateAPIView):
    queryset = Content.objects.all()
    serializer_class = ContentSerializer
    parser_classes = (MultiPartParser, FormParser)
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        try:
            print(f"Request data: {request.data}")  # Debug log
            print(f"Request FILES: {request.FILES}")  # Debug log
            print(f"User role: {request.user.role}")  # Debug log

            if request.user.role not in ['admin', 'healthcare_provider']:
                return Response(
                    {'error': 'Only admins and healthcare providers can upload content'},
                    status=status.HTTP_403_FORBIDDEN
                )

            file = request.FILES.get('file')
            if not file:
                return Response(
                    {'error': 'No file provided'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            serializer = self.get_serializer(data=request.data)
            if serializer.is_valid():
                serializer.save(
                    created_by=request.user,
                    uploaded_file=file
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
            print(f"Upload error: {str(e)}")  # Debug log
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class ContentDetailView(generics.RetrieveDestroyAPIView):
    queryset = Content.objects.all()
    serializer_class = ContentSerializer
    permission_classes = [permissions.IsAuthenticated, IsHealthcareProvider]

    def check_object_permissions(self, request, obj):
        if request.method == 'DELETE' and not IsHealthcareProvider().has_permission(request, self):
            self.permission_denied(request)
        return super().check_object_permissions(request, obj)

class ContentViewSet(viewsets.ModelViewSet):
    queryset = Content.objects.all()
    serializer_class = ContentSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = (JSONParser, MultiPartParser, FormParser)

    def get_permissions(self):
        if self.action in ['create', 'update', 'destroy']:
            # Allow both healthcare providers and admins
            return [permissions.IsAuthenticated(), IsHealthcareProvider()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        queryset = Content.objects.all()
        if self.request.query_params.get('include_creator'):
            queryset = queryset.select_related('created_by')
        return queryset

    def destroy(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            # Only allow creators or admins to delete
            if request.user.is_staff or request.user == instance.created_by:
                self.perform_destroy(instance)
                return Response({"detail": "Resource deleted successfully"}, 
                              status=status.HTTP_204_NO_CONTENT)
            else:
                return Response({"detail": "You don't have permission to delete this resource"}, 
                              status=status.HTTP_403_FORBIDDEN)
        except Content.DoesNotExist:
            return Response({"detail": "Resource not found"}, 
                          status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['patch'])
    def approve(self, request, pk=None):
        if request.user.role != 'admin':
            return Response(
                {"detail": "Only admins can approve content"}, 
                status=status.HTTP_403_FORBIDDEN
            )

        try:
            instance = self.get_object()
            instance.status = 'approved'  # Set status to approved
            instance.is_approved = True
            instance.approval_date = timezone.now()
            instance.approved_by = request.user
            instance.rejection_reason = None  # Clear any previous rejection reason
            instance.save()

            serializer = self.get_serializer(instance)
            return Response({
                "detail": "Resource approved successfully",
                "resource": serializer.data
            })
        except Exception as e:
            return Response(
                {"detail": f"Error approving resource: {str(e)}"}, 
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=True, methods=['patch'])
    def reject(self, request, pk=None):
        try:
            if not request.user.role == 'admin':
                return Response(
                    {"error": "Only admins can reject content"}, 
                    status=status.HTTP_403_FORBIDDEN
                )

            instance = self.get_object()
            
            try:
                data = request.data
                if isinstance(data, str):
                    import json
                    data = json.loads(data)
            except Exception as e:
                print(f"Data parsing error: {e}")
                data = request.data

            rejection_reason = data.get('rejection_reason')
            if not rejection_reason:
                return Response(
                    {"error": "Rejection reason is required"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            instance.status = 'rejected'
            instance.rejection_reason = rejection_reason
            instance.is_approved = False
            instance.approval_date = None
            instance.approved_by = None
            instance.save()

            serializer = self.get_serializer(instance)
            return Response(serializer.data)

        except Exception as e:
            print(f"Rejection error: {str(e)}")
            return Response(
                {"error": str(e)}, 
                status=status.HTTP_400_BAD_REQUEST
            )
