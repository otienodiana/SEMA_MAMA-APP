from django.core.management.base import BaseCommand
from django.core.management import call_command

class Command(BaseCommand):
    help = 'Runs the server with debug output'

    def handle(self, *args, **options):
        self.stdout.write('Starting server...')
        try:
            call_command(
                'runserver',
                '0.0.0.0:8000',  # Use 0.0.0.0 to allow all connections
                use_reloader=True,
                use_threading=True
            )
        except Exception as e:
            self.stderr.write(self.style.ERROR(f'Server failed to start: {e}'))
