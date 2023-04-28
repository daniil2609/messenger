from django.contrib import admin
from . import models


@admin.register(models.User)
class AuthUserAdmin(admin.ModelAdmin):
    list_display = ('id', 'email', 'username')
    list_display_links = ('email',)
