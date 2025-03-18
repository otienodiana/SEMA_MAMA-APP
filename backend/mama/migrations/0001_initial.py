# Generated by Django 5.1.7 on 2025-03-18 19:51

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='PostpartumDepressionQuestion',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('question_text', models.CharField(max_length=500)),
                ('order', models.IntegerField(default=0)),
                ('is_active', models.BooleanField(default=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'ordering': ['order'],
            },
        ),
        migrations.CreateModel(
            name='AssessmentResponse',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('response', models.IntegerField(choices=[(0, 'Never'), (1, 'Sometimes'), (2, 'Often'), (3, 'Always')])),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('question', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='mama.postpartumdepressionquestion')),
            ],
        ),
        migrations.CreateModel(
            name='AssessmentResult',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('total_score', models.IntegerField()),
                ('risk_level', models.CharField(choices=[('low', 'Low Risk'), ('moderate', 'Moderate Risk'), ('high', 'High Risk')], max_length=20)),
                ('completed_at', models.DateTimeField(auto_now_add=True)),
                ('notes', models.TextField(blank=True)),
                ('responses', models.ManyToManyField(to='mama.assessmentresponse')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Setting',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('language', models.CharField(choices=[('en', 'English'), ('sw', 'Swahili'), ('fr', 'French')], default='en', max_length=10)),
                ('dark_mode', models.BooleanField(default=False)),
                ('notifications', models.CharField(choices=[('all', 'All Notifications'), ('email', 'Email Only'), ('sms', 'SMS Only'), ('none', 'No Notifications')], default='all', max_length=10)),
                ('privacy', models.CharField(choices=[('public', 'Public'), ('private', 'Private'), ('friends', 'Friends Only')], default='public', max_length=10)),
                ('timezone', models.CharField(choices=[('UTC', 'UTC'), ('EAT', 'East Africa Time'), ('CET', 'Central European Time')], default='UTC', max_length=10)),
                ('content_preferences', models.JSONField(blank=True, default=list)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='settings', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
