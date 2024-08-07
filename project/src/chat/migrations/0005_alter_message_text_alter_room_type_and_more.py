# Generated by Django 4.2.1 on 2023-05-26 20:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0004_alter_task_description'),
    ]

    operations = [
        migrations.AlterField(
            model_name='message',
            name='text',
            field=models.CharField(max_length=2048),
        ),
        migrations.AlterField(
            model_name='room',
            name='type',
            field=models.CharField(choices=[('1', 'Персональный чат'), ('2', 'Групповой чат'), ('3', 'Групповой приватный чат')], max_length=32),
        ),
        migrations.AlterField(
            model_name='task',
            name='board_name',
            field=models.CharField(choices=[('1', 'Сделать'), ('2', 'В процессе'), ('3', 'На проверке'), ('4', 'Выполнено')], default='1', max_length=32),
        ),
        migrations.AlterField(
            model_name='task',
            name='description',
            field=models.CharField(blank=True, max_length=2048, null=True),
        ),
        migrations.AlterField(
            model_name='task',
            name='name',
            field=models.CharField(max_length=256),
        ),
    ]
