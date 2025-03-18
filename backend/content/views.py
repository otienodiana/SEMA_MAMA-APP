from rest_framework import generics, permissions
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
        return request.user.role == 'healthcare_provider'

class ContentListView(generics.ListAPIView):
    queryset = Content.objects.all()
    serializer_class = ContentSerializer
    permission_classes = [permissions.IsAuthenticated]

class ContentUploadView(generics.CreateAPIView):
    queryset = Content.objects.all()
    serializer_class = ContentSerializer
    parser_classes = (MultiPartParser, FormParser)
    permission_classes = [permissions.IsAuthenticated, IsHealthcareProvider]

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
        serializer.save(uploaded_by=self.request.user)

    def create(self, request, *args, **kwargs):
        try:
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

                # Validate file presence and content
                if 'file' not in request.FILES:
                    raise ParseError('No file provided')

                file = request.FILES['file']
                self.validate_file(file)

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
