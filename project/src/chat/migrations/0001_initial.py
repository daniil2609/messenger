# Generated by Django 4.2 on 2023-05-10 08:46

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Room',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('display_name', models.CharField(blank=True, max_length=128, null=True)),
                ('name', models.CharField(max_length=128, unique=True)),
                ('type', models.CharField(choices=[('1', 'personal_chat'), ('2', 'group_chat')], max_length=2)),
                ('participant', models.ManyToManyField(to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Message',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('text', models.CharField(max_length=1024)),
                ('time_message', models.DateTimeField(auto_now_add=True)),
                ('read_users', models.ManyToManyField(related_name='messages_read_users', to=settings.AUTH_USER_MODEL)),
                ('room', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='chat.room')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='messages_creator', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]