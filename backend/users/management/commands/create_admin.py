from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.db import transaction

User = get_user_model()

class Command(BaseCommand):
    help = 'Create a new admin user'

    def add_arguments(self, parser):
        parser.add_argument('--username', type=str, required=True)
        parser.add_argument('--email', type=str, required=True)
        parser.add_argument('--password', type=str, required=True)
        parser.add_argument('--phone', type=str, required=True)
        parser.add_argument('--first_name', type=str, required=False)
        parser.add_argument('--last_name', type=str, required=False)

    def handle(self, *args, **options):
        username = options['username']
        email = options['email']
        password = options['password']
        phone_number = options['phone']
        first_name = options.get('first_name', '')
        last_name = options.get('last_name', '')

        try:
            with transaction.atomic():
                if User.objects.filter(username=username).exists():
                    self.stdout.write(
                        self.style.WARNING(f'User {username} already exists')
                    )
                    return

                user = User.objects.create_user(
                    username=username,
                    email=email,
                    password=password,
                    phone_number=phone_number,
                    first_name=first_name,
                    last_name=last_name,
                    role='admin',
                    is_staff=True,
                    is_superuser=True,
                    is_active=True
                )

                self.stdout.write(
                    self.style.SUCCESS(
                        f'\nSuccessfully created admin user:\n'
                        f'Username: {user.username}\n'
                        f'Email: {user.email}\n'
                        f'Role: {user.role}\n'
                        f'Is staff: {user.is_staff}\n'
                        f'Is superuser: {user.is_superuser}\n'
                    )
                )

        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating admin user: {str(e)}')
            )
