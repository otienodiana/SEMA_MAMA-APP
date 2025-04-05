import os
from django.core.management import execute_from_command_line
from django.conf import settings

def run_server():
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
    
    # Ensure media directory exists
    media_root = settings.MEDIA_ROOT
    forum_pictures = os.path.join(media_root, 'forum_pictures')
    profile_photos = os.path.join(media_root, 'profile_photos')
    
    for directory in [media_root, forum_pictures, profile_photos]:
        os.makedirs(directory, exist_ok=True)
    
    execute_from_command_line(['manage.py', 'runserver'])

if __name__ == '__main__':
    run_server()
