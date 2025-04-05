from rest_framework import generics, permissions, viewsets, filters
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.db.models import Q
from .models import Content
from .serializers import ContentSerializer
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
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

class ContentViewSet(viewsets.ModelViewSet):
    queryset = Content.objects.all()
    serializer_class = ContentSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

class ContentListCreateView(generics.ListCreateAPIView):
    serializer_class = ContentSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'title']

    def get_queryset(self):
        if self.request.user.role == 'admin':
            # Admin sees all content
            return Content.objects.all()
        elif self.request.user.role == 'healthcare_provider':
            # Healthcare providers see their own content and approved content
            return Content.objects.filter(
                Q(created_by=self.request.user) | 
                Q(is_approved=True)
            )
        else:
            # Moms see only approved content
            return Content.objects.filter(is_approved=True)

    def perform_create(self, serializer):
        # Auto-approve content created by admins
        is_approved = self.request.user.role == 'admin'
        serializer.save(
            created_by=self.request.user,
            is_approved=is_approved
        )

class ContentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Content.objects.all()
    serializer_class = ContentSerializer
    permission_classes = [permissions.IsAuthenticated]

class ContentUploadView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        try:
            file_serializer = ContentSerializer(data=request.data)
            if file_serializer.is_valid():
                file_serializer.save(created_by=request.user)
                return Response(file_serializer.data, status=status.HTTP_201_CREATED)
            return Response(file_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ManageContentView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ContentSerializer

    def post(self, request, content_id):
        if request.user.role != 'admin':
            return Response(
                {"error": "Only admins can manage content"}, 
                status=status.HTTP_403_FORBIDDEN
            )

        try:
            content = Content.objects.get(id=content_id)
            action = request.data.get('action')

            if action == 'approve':
                content.is_approved = True
                content.save()
                return Response({"message": "Content approved"})
            elif action == 'reject':
                content.is_approved = False
                content.save()
                return Response({"message": "Content rejected"})
            elif action == 'delete':
                content.delete()
                return Response({"message": "Content deleted"})
            else:
                return Response(
                    {"error": "Invalid action"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

        except Content.DoesNotExist:
            return Response(
                {"error": "Content not found"}, 
                status=status.HTTP_404_NOT_FOUND
            )
