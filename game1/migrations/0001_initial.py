# Generated by Django 4.2.11 on 2024-06-08 18:05

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='ChessMoves',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('Mode', models.CharField(max_length=10)),
                ('move', models.CharField(max_length=60000)),
                ('Termination_Type', models.CharField(max_length=40)),
            ],
        ),
    ]
