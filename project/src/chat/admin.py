from django.contrib import admin
from . import models


@admin.register(models.Room)
class AuthUserAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'type')
    list_display_links = ('name',)
    filter_horizontal = ['participant']


@admin.register(models.Message)
class AuthUserAdmin(admin.ModelAdmin):
    list_display = ('id', 'text', 'room')
    list_display_links = ('id',)
    filter_horizontal = ['read_users']

