# Generated by Django 5.1.7 on 2025-03-30 23:37

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('community', '0002_alter_comment_options_alter_forum_options_and_more'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='forum',
            name='updated_at',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AlterField(
            model_name='forum',
            name='created_by',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='community_created_forums', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='forum',
            name='members',
            field=models.ManyToManyField(blank=True, related_name='community_joined_forums', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='forum',
            name='name',
            field=models.CharField(max_length=200),
        ),
    ]
