from django.core.management.base import BaseCommand
from community.models import Forum

class Command(BaseCommand):
    help = 'Fix forum categories for existing forums'

    def handle(self, *args, **kwargs):
        # Get all forums with empty or incorrect categories
        forums = Forum.objects.all()
        
        for forum in forums:
            if not forum.category or forum.category not in dict(Forum.CATEGORY_CHOICES):
                forum.category = 'General'
                forum.save()
                self.stdout.write(
                    self.style.SUCCESS(
                        f'Updated forum "{forum.name}" category to General'
                    )
                )
