# Generated by Django 4.2.1 on 2023-05-18 09:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0003_alter_room_type_task'),
    ]

    operations = [
        migrations.AlterField(
            model_name='task',
            name='description',
            field=models.CharField(blank=True, max_length=500, null=True),
        ),
    ]
