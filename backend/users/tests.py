from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from .models import User
from django.core.exceptions import ValidationError
import logging

logger = logging.getLogger(__name__)

class AuthenticationTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.register_url = reverse('register')
        self.login_url = reverse('token_obtain_pair')
        self.user_data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'testpass123',
            'role': 'mom',
            'phone_number': '1234567890'
        }

    def test_user_registration(self):
        logger.info("Testing user registration...")
        response = self.client.post(self.register_url, self.user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username='testuser').exists())

    def test_user_login(self):
        # Create user first
        User.objects.create_user(username='testuser', password='testpass123')
        response = self.client.post(self.login_url, {
            'username': 'testuser',
            'password': 'testpass123'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_invalid_login(self):
        response = self.client.post(self.login_url, {
            'username': 'nonexistent',
            'password': 'wrongpass'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

class UserModelTests(TestCase):
    def setUp(self):
        self.user_data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'testpass123',
            'role': 'mom',
            'phone_number': '1234567890'
        }

    def test_create_user(self):
        user = User.objects.create_user(**self.user_data)
        self.assertTrue(isinstance(user, User))
        self.assertEqual(user.username, 'testuser')
        self.assertTrue(user.check_password('testpass123'))

    def test_invalid_role(self):
        self.user_data['role'] = 'invalid_role'
        with self.assertRaises(ValidationError):
            user = User.objects.create_user(**self.user_data)
            user.full_clean()
