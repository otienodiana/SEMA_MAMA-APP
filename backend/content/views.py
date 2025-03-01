from rest_framework import generics, permissions
from .models import Content
from .serializers import ContentSerializer
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.generics import RetrieveUpdateDestroyAPIView


class ContentListCreateView(generics.ListCreateAPIView):
    queryset = Content.objects.all()
    serializer_class = ContentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(uploaded_by=self.request.user)

class ContentDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Content.objects.all()
    serializer_class = ContentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        try:
            content = self.get_object()  # Retrieve the content object
            serializer = self.get_serializer(content)  # Serialize it
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Content.DoesNotExist:
            return Response({"error": "Content not found"}, status=status.HTTP_404_NOT_FOUND)

    def patch(self, request, *args, **kwargs):
        content = self.get_object()
        serializer = self.get_serializer(content, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ContentUploadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # Get the file from the request
        file = request.FILES.get('file')
        title = request.data.get('title')
        description = request.data.get('description')
        content_type = request.data.get('content_type', 'other')

        if not file or not title:
            return Response({'error': 'File and title are required.'}, status=status.HTTP_400_BAD_REQUEST)

        # Save the content with the uploaded file
        content = Content.objects.create(
            title=title,
            description=description,
            file=file,
            content_type=content_type,
            uploaded_by=request.user,
        )

        serializer = ContentSerializer(content)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class ContentDeleteView(generics.DestroyAPIView):
    queryset = Content.objects.all()
    serializer_class = ContentSerializer
    permission_classes = [permissions.IsAuthenticated]
