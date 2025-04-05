from django.db import models
from django.conf import settings

class Appointment(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('scheduled', 'Scheduled'),
        ('approved', 'Approved'),
        ('completed', 'Completed'),
        ('canceled', 'Canceled'),
        ('rejected', 'Rejected'),
    ]

    CONSULTATION_TYPE_CHOICES = [
        ('virtual', 'Virtual Consultation'),
        ('in_person', 'In-Person Visit'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="appointments")
    provider = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name="provider_appointments"
    )  # ✅ Associate an appointment with a provider

    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    date = models.DateTimeField()
    rescheduled_at = models.DateTimeField(null=True, blank=True)  # ✅ Track rescheduling
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    rejection_reason = models.TextField(blank=True, null=True)  # ✅ Store rejection reasons
    created_at = models.DateTimeField(auto_now_add=True)

    consultation_type = models.CharField(
        max_length=20, 
        choices=CONSULTATION_TYPE_CHOICES,
        default='in_person'
    )
    meeting_link = models.URLField(blank=True, null=True)
    notes_for_provider = models.TextField(blank=True, null=True)
    preferred_language = models.CharField(max_length=50, blank=True, null=True)
    technical_requirements = models.TextField(
        blank=True,
        null=True,
        help_text="Any technical requirements or preferences for virtual consultation"
    )
    user_email = models.EmailField(null=True, blank=True)  # Add this field

    def __str__(self):
        return f"{self.title} ({self.status}) - {self.date.strftime('%Y-%m-%d %H:%M')}"
