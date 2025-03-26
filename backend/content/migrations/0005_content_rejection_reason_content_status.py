# Generated by Django 5.1.7 on 2025-03-26 20:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0004_content_approval_date_content_approved_by_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='content',
            name='rejection_reason',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='content',
            name='status',
            field=models.CharField(choices=[('pending', 'Pending'), ('approved', 'Approved'), ('rejected', 'Rejected')], default='pending', max_length=20),
        ),
    ]
