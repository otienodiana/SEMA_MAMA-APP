from django.core.management.base import BaseCommand
from mama.models import PostpartumDepressionQuestion

class Command(BaseCommand):
    help = 'Creates sample postpartum depression assessment questions'

    def handle(self, *args, **kwargs):
        questions = [
            "I have been able to laugh and see the funny side of things",
            "I have looked forward with enjoyment to things",
            "I have blamed myself unnecessarily when things went wrong",
            "I have been anxious or worried for no good reason",
            "I have felt scared or panicky for no very good reason",
            "Things have been getting on top of me",
            "I have been so unhappy that I have had difficulty sleeping",
            "I have felt sad or miserable",
            "I have been so unhappy that I have been crying",
            "The thought of harming myself has occurred to me"
        ]

        for i, question_text in enumerate(questions, 1):
            PostpartumDepressionQuestion.objects.get_or_create(
                question_text=question_text,
                order=i,
                is_active=True
            )
            self.stdout.write(self.style.SUCCESS(f'Created question: {question_text}'))
