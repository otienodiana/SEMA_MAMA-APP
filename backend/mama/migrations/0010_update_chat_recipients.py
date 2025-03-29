from django.db import migrations
from django.conf import settings

def update_null_recipients(apps, schema_editor):
    ChatMessage = apps.get_model('mama', 'ChatMessage')
    User = apps.get_model(settings.AUTH_USER_MODEL.split('.')[0], settings.AUTH_USER_MODEL.split('.')[1])
    
    # Create system user if doesn't exist
    system_user, _ = User.objects.get_or_create(
        username='system',
        defaults={
            'first_name': 'System',
            'last_name': 'User',
            'email': 'system@example.com'
        }
    )
    
    # Update null recipients
    ChatMessage.objects.filter(recipient__isnull=True).update(recipient=system_user)

class Migration(migrations.Migration):
    dependencies = [
        ('mama', '0009_chatmessage_mama_chatme_sender__bc03ee_idx_and_more'),
    ]

    operations = [
        migrations.RunPython(update_null_recipients, migrations.RunPython.noop),
    ]
