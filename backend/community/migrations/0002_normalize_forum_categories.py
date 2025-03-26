from django.db import migrations

def normalize_categories(apps, schema_editor):
    Forum = apps.get_model('community', 'Forum')
    
    # Update existing forums to use proper categories
    category_mapping = {
        '': 'General',
        'general': 'General',
        'pregnancy': 'Pregnancy',
        'postpartum': 'Postpartum',
        'parenting': 'Parenting',
        'mental_health': 'Mental Health'
    }
    
    for forum in Forum.objects.all():
        raw_category = forum.category.lower().strip()
        forum.category = category_mapping.get(raw_category, 'General')
        forum.save()

class Migration(migrations.Migration):
    dependencies = [
        ('community', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(normalize_categories),
    ]
