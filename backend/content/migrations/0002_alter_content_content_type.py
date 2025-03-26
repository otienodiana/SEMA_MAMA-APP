# Generated by Django 5.1.7 on 2025-03-26 14:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='content',
            name='content_type',
            field=models.CharField(choices=[('article', 'Article'), ('video', 'Video'), ('image', 'Image'), ('document', 'Document'), ('other', 'Other'), ('infographic', 'Infographic')], max_length=20),
        ),
    ]
