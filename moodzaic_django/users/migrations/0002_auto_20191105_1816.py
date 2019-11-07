# Generated by Django 2.2.6 on 2019-11-05 18:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Goal',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('goal', models.CharField(max_length=30)),
                ('frequency', models.IntegerField(default=1)),
                ('time', models.TimeField()),
            ],
        ),
        migrations.AlterField(
            model_name='user',
            name='age',
            field=models.IntegerField(default=18),
        ),
    ]