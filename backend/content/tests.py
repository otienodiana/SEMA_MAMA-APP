from django.test import TestCase
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework.test import APIClient, APITestCase
from rest_framework import status
from django.urls import reverse
from users.models import User
from .models import Content
import os
from unittest.mock import patch
import tempfile
from django.core.files.storage import default_storage
from django.test.utils import override_settings
import shutil
from django.db import transaction
from rest_framework.test import APIRequestFactory
from rest_framework.test import force_authenticate
from django.core.files.base import ContentFile
from django.test import override_settings
from .views import ContentUploadView, ContentDetailView, ContentListView
import json

class FileOperationsTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123',
            role='healthcare_provider'
        )
        self.client.force_authenticate(user=self.user)
        self.test_file = SimpleUploadedFile(
            "test_file.txt",
            b"test content",
            content_type="text/plain"
        )

    def test_file_upload(self):
        response = self.client.post(reverse('content-upload'), {
            'title': 'Test File',
            'description': 'Test Description',
            'file': self.test_file,
            'content_type': 'document'  # Added content_type
        }, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Content.objects.filter(title='Test File').exists())

    def tearDown(self):
        for content in Content.objects.all():
            if content.file and os.path.isfile(content.file.path):
                os.remove(content.file.path)

class ContentIntegrationTests(APITestCase):
    def setUp(self):
        # Create two different types of users
        self.provider = User.objects.create_user(
            username='provider',
            password='provider123',
            role='healthcare_provider'
        )
        self.patient = User.objects.create_user(
            username='patient',
            password='patient123',
            role='patient'
        )
        self.test_file = SimpleUploadedFile(
            "test_file.txt",
            b"test content",
            content_type="text/plain"
        )

    def test_file_upload_as_provider(self):
        self.client.force_authenticate(user=self.provider)
        response = self.client.post(reverse('content-upload'), {
            'title': 'Test Upload',
            'description': 'Test Description',
            'file': self.test_file,
            'content_type': 'document'  # Added content_type
        }, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_file_upload_as_patient(self):
        self.client.force_authenticate(user=self.patient)
        response = self.client.post(reverse('content-upload'), {
            'title': 'Patient Upload',
            'description': 'Should Fail',
            'file': self.test_file,
            'content_type': 'document'
        }, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_file_delete_permissions(self):
        # First authenticate as provider to create content
        self.client.force_authenticate(user=self.provider)
        upload_response = self.client.post(reverse('content-upload'), {
            'title': 'To Delete',
            'description': 'File to be deleted',
            'file': self.test_file,
            'content_type': 'document'  # Added content_type
        }, format='multipart')
        self.assertEqual(upload_response.status_code, status.HTTP_201_CREATED)
        content_id = upload_response.data['id']

        # Switch to patient and try to delete (should fail with 403)
        self.client.force_authenticate(user=self.patient)
        patient_delete = self.client.delete(reverse('content-detail', args=[content_id]))
        self.assertEqual(patient_delete.status_code, status.HTTP_403_FORBIDDEN)

        # Switch back to provider and delete
        self.client.force_authenticate(user=self.provider)
        provider_delete = self.client.delete(reverse('content-detail', args=[content_id]))
        self.assertEqual(provider_delete.status_code, status.HTTP_204_NO_CONTENT)

    def test_file_listing(self):
        self.client.force_authenticate(user=self.provider)
        response = self.client.get(reverse('contents-list'))  # Updated URL name
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def tearDown(self):
        Content.objects.all().delete()
        User.objects.all().delete()
        
        # Clean up any physical files that might remain
        test_upload_dir = os.path.join('media', 'uploads', 'content')
        if os.path.exists(test_upload_dir):
            for file in os.listdir(test_upload_dir):
                file_path = os.path.join(test_upload_dir, file)
                try:
                    if os.path.isfile(file_path):
                        os.unlink(file_path)
                except Exception as e:
                    print(f'Error deleting {file_path}: {e}')

class ContentValidationTests(APITestCase):
    def setUp(self):
        self.provider = User.objects.create_user(
            username='provider',
            password='provider123',
            role='healthcare_provider'
        )
        self.client.force_authenticate(user=self.provider)

    def test_empty_fields(self):
        # Test empty title
        response = self.client.post(reverse('content-upload'), {
            'description': 'Test Description',
            'file': SimpleUploadedFile("test.txt", b"content"),
            'content_type': 'document'
        }, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # Test empty description
        response = self.client.post(reverse('content-upload'), {
            'title': 'Test Title',
            'file': SimpleUploadedFile("test.txt", b"content"),
            'content_type': 'document'
        }, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_invalid_file_formats(self):
        # Test unsupported file format
        response = self.client.post(reverse('content-upload'), {
            'title': 'Invalid Format',
            'description': 'Test Description',
            'file': SimpleUploadedFile("test.exe", b"malicious content", content_type="application/x-msdownload"),
            'content_type': 'document'
        }, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # Test empty file
        response = self.client.post(reverse('content-upload'), {
            'title': 'Empty File',
            'description': 'Test Description',
            'file': SimpleUploadedFile("empty.txt", b""),
            'content_type': 'document'
        }, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_file_size_limits(self):
        # Create a large file that exceeds limit
        with tempfile.NamedTemporaryFile() as tmp:
            tmp.write(b'0' * (1024 * 1024 * 11))  # 11MB file
            tmp.seek(0)
            response = self.client.post(reverse('content-upload'), {
                'title': 'Too Large',
                'description': 'Test Description',
                'file': tmp,
                'content_type': 'document'
            }, format='multipart')
            self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    @override_settings(MEDIA_ROOT='/tmp/test_storage')
    def test_storage_errors(self):
        def mock_save(*args, **kwargs):
            raise IOError("Storage error")

        with transaction.atomic():
            with patch.object(default_storage, 'save', side_effect=mock_save):
                response = self.client.post(reverse('content-upload'), {
                    'title': 'Storage Error Test',
                    'description': 'Test Description',
                    'file': SimpleUploadedFile("test.txt", b"content"),
                    'content_type': 'document'
                }, format='multipart')

        self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)
        self.assertEqual(response.data['error'], 'Storage error occurred')

    def test_duplicate_title(self):
        # Create first content
        self.client.post(reverse('content-upload'), {
            'title': 'Duplicate Title',
            'description': 'First upload',
            'file': SimpleUploadedFile("test1.txt", b"content"),
            'content_type': 'document'
        }, format='multipart')

        # Try to create second content with same title
        response = self.client.post(reverse('content-upload'), {
            'title': 'Duplicate Title',
            'description': 'Second upload',
            'file': SimpleUploadedFile("test2.txt", b"content"),
            'content_type': 'document'
        }, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def tearDown(self):
        try:
            with transaction.atomic():
                Content.objects.all().delete()
                User.objects.all().delete()
        except Exception as e:
            print(f"Error during teardown: {e}")
        # Clean up test media directory
        if os.path.exists('/tmp/test_storage'):
            shutil.rmtree('/tmp/test_storage')

class ContentFunctionalTests(APITestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.provider = User.objects.create_user(
            username='provider',
            password='provider123',
            role='healthcare_provider'
        )
        self.test_file = SimpleUploadedFile(
            "test_file.txt",
            b"test content",
            content_type="text/plain"
        )

    def test_content_lifecycle(self):
        """Test complete content lifecycle: create, read, update, delete"""
        with transaction.atomic():
            # Create content
            url = reverse('content-upload')
            data = {
                'title': 'Lifecycle Test',
                'description': 'Testing content lifecycle',
                'file': self.test_file,
                'content_type': 'document'
            }
            
            request = self.factory.post(url, data, format='multipart')
            force_authenticate(request, user=self.provider)
            response = ContentUploadView.as_view()(request)
            self.assertEqual(response.status_code, status.HTTP_201_CREATED)
            content_id = response.data['id']

            # Read content
            url = reverse('content-detail', args=[content_id])
            request = self.factory.get(url)
            force_authenticate(request, user=self.provider)
            response = ContentDetailView.as_view()(request, pk=content_id)
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            self.assertEqual(response.data['title'], 'Lifecycle Test')

            # Delete content
            request = self.factory.delete(url)
            force_authenticate(request, user=self.provider)
            response = ContentDetailView.as_view()(request, pk=content_id)
            self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_content_search_filter(self):
        """Test content search and filtering capabilities"""
        with transaction.atomic():
            # Create test content
            upload_request = self.factory.post(
                reverse('content-upload'),
                {
                    'title': 'Test PDF',
                    'description': 'PDF document',
                    'file': SimpleUploadedFile("test.pdf", b"content", content_type="application/pdf"),
                    'content_type': 'document'
                },
                format='multipart'
            )
            force_authenticate(upload_request, user=self.provider)
            upload_response = ContentUploadView.as_view()(upload_request)
            self.assertEqual(upload_response.status_code, status.HTTP_201_CREATED)

            # Test filtering
            filter_request = self.factory.get(reverse('contents-list'), {'content_type': 'document'})
            force_authenticate(filter_request, user=self.provider)
            filter_response = ContentListView.as_view()(filter_request)
            self.assertEqual(filter_response.status_code, status.HTTP_200_OK)
            self.assertEqual(len(filter_response.data), 1)

    def tearDown(self):
        try:
            with transaction.atomic():
                Content.objects.all().delete()
                User.objects.all().delete()
        except Exception as e:
            print(f"Error during teardown: {e}")

class ContentSystemTests(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.provider = User.objects.create_user(
            username='provider',
            password='provider123',
            role='healthcare_provider'
        )
        cls.patient = User.objects.create_user(
            username='patient',
            password='patient123',
            role='patient'
        )

    def setUp(self):
        self.client = APIClient()

    def test_concurrent_uploads(self):
        """Test system behavior with concurrent uploads"""
        self.client.force_authenticate(user=self.provider)
        responses = []
        
        # Simulate concurrent uploads
        for i in range(5):
            file = SimpleUploadedFile(
                f"test_file_{i}.txt",
                f"content_{i}".encode(),
                content_type="text/plain"
            )
            response = self.client.post(reverse('content-upload'), {
                'title': f'Concurrent Test {i}',
                'description': f'Testing concurrent upload {i}',
                'file': file,
                'content_type': 'document'
            }, format='multipart')
            responses.append(response)

        # Verify all uploads succeeded
        self.assertTrue(all(r.status_code == status.HTTP_201_CREATED for r in responses))
        self.assertEqual(Content.objects.count(), 5)

    @override_settings(MEDIA_ROOT='/tmp/test_storage')
    def test_system_resource_limits(self):
        """Test system behavior under resource constraints"""
        self.client.force_authenticate(user=self.provider)
        
        # Test with large file count
        for i in range(10):
            response = self.client.post(reverse('content-upload'), {
                'title': f'Resource Test {i}',
                'description': f'Testing resource limits {i}',
                'file': SimpleUploadedFile(f"test_{i}.txt", b"content", content_type="text/plain"),
                'content_type': 'document'
            }, format='multipart')
            self.assertIn(response.status_code, [status.HTTP_201_CREATED, status.HTTP_500_INTERNAL_SERVER_ERROR])

    def test_system_error_recovery(self):
        """Test system recovery from errors"""
        self.client.force_authenticate(user=self.provider)
        
        # Create invalid request
        response = self.client.post(reverse('content-upload'), {
            'title': 'Error Recovery Test',
            'description': 'Testing error recovery',
            'file': SimpleUploadedFile("test.txt", b"", content_type="text/plain"),
            'content_type': 'invalid'
        }, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # Verify system can still handle valid requests
        response = self.client.post(reverse('content-upload'), {
            'title': 'Valid Request',
            'description': 'Testing system recovery',
            'file': SimpleUploadedFile("valid.txt", b"content", content_type="text/plain"),
            'content_type': 'document'
        }, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def tearDown(self):
        try:
            with transaction.atomic():
                Content.objects.all().delete()
        except Exception as e:
            print(f"Error during tearDown: {e}")
        
        if os.path.exists('/tmp/test_storage'):
            shutil.rmtree('/tmp/test_storage')
