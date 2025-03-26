from rest_framework import generics, permissions, viewsets
from rest_framework.parsers import MultiPartParser, FormParser
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

    def validate_file(self, file):
        # Check file size (10MB limit)
        if file.size > 10 * 1024 * 1024:
            raise ParseError('File size too large. Maximum size is 10MB')

        # Check file extension and mime type
        file_name = file.name.lower()
        mime_type, _ = mimetypes.guess_type(file_name)
        
        allowed_extensions = ['.txt', '.pdf', '.jpg', '.jpeg', '.png']
        allowed_mimetypes = ['text/plain', 'application/pdf', 'image/jpeg', 'image/png']
        
        if not any(file_name.endswith(ext) for ext in allowed_extensions):
            raise ParseError('Unsupported file extension')
            
        if mime_type not in allowed_mimetypes:
            raise ParseError(f'Unsupported file type: {mime_type}')

        # Check if file is empty
        if file.size == 0:
            raise ParseError('Empty file uploaded')

    def perform_create(self, serializer):
        if not self.request.user.is_authenticated:
            raise ParseError('User must be authenticated')
        
        print(f"User role: {self.request.user.role}")  # Debug log
        
        if not hasattr(self.request.user, 'role'):
            raise ParseError('User role not found')
        
        if self.request.user.role not in ['healthcare_provider', 'admin']:
            raise ParseError('Only healthcare providers and admins can upload content')
            
        serializer.save(created_by=self.request.user)

    def create(self, request, *args, **kwargs):
        try:
            print(f"Request data: {request.data}")  # Debug log
            print(f"Request FILES: {request.FILES}")  # Debug log
            with transaction.atomic():
                # Validate required fields
                if not request.data.get('title'):
                    raise ParseError('Title is required')
                if not request.data.get('description'):
                    raise ParseError('Description is required')
                if not request.data.get('content_type'):
                    raise ParseError('Content type is required')

                # Check for duplicate title before file validation
                title = request.data.get('title')
                if Content.objects.filter(title=title).exists():
                    raise ParseError(f'Content with title "{title}" already exists')

                # Check both possible field names for the file
                file = request.FILES.get('file') or request.FILES.get('uploaded_file')
                if not file:
                    raise ParseError('No file provided')

                self.validate_file(file)

                # Add file to request.data
                request.data['uploaded_file'] = file

                serializer = self.get_serializer(data=request.data)
                serializer.is_valid(raise_exception=True)
                
                try:
                    self.perform_create(serializer)
                except IOError:
                    return Response(
                        {'error': 'Storage error occurred'},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR
                    )

                headers = self.get_success_headers(serializer.data)
                return Response(
                    serializer.data,
                    status=status.HTTP_201_CREATED,
                    headers=headers
                )

        except ParseError as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
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
    parser_classes = (MultiPartParser, FormParser)

    def get_permissions(self):
        if self.action in ['create', 'update', 'destroy']:
            # Allow both healthcare providers and admins
            return [permissions.IsAuthenticated(), IsHealthcareProvider()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            # Admins can see all content
            return Content.objects.all()
        elif user.role == 'healthcare_provider':
            # Healthcare providers see their own content
            return Content.objects.filter(created_by=user)
        else:
            # Regular users (moms) can see all published content
            return Content.objects.all()

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
