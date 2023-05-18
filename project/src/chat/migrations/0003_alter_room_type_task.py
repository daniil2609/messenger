# Generated by Django 4.2.1 on 2023-05-18 09:36

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0002_alter_room_type'),
    ]

    operations = [
        migrations.AlterField(
            model_name='room',
            name='type',
            field=models.CharField(choices=[('1', 'Персональный чат'), ('2', 'Групповой чат'), ('3', 'Групповой приватный чат')], max_length=2),
        ),
        migrations.CreateModel(
            name='Task',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('board_name', models.CharField(choices=[('1', 'Сделать'), ('2', 'В процессе'), ('3', 'На проверке'), ('4', 'Выполнено')], default='1', max_length=12)),
                ('name', models.CharField(max_length=128)),
                ('description', models.CharField(max_length=500)),
                ('time_create', models.DateTimeField(auto_now_add=True)),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='tasks', to='chat.room')),
            ],
        ),
    ]
