# Generated by Django 5.1.6 on 2025-03-01 10:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0002_user_age_user_profile_photo'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='is_healthcare_provider',
        ),
        migrations.AddField(
            model_name='user',
            name='role',
            field=models.CharField(choices=[('mom', 'mom'), ('healthcare_provider', 'Healthcare Provider'), ('admin', 'Admin')], default='regular', max_length=20),
        ),
    ]
