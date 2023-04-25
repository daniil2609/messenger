from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator
from django.contrib.auth.validators import UnicodeUsernameValidator
from django.utils.translation import gettext_lazy as _


class User(AbstractUser):
    email = models.EmailField(
        ('email address'),
        unique=True,
    )
    username_validator = UnicodeUsernameValidator()
    username = models.CharField(
        _('username'),
        max_length=40,
        unique=False,
        help_text=_('Required. 40 characters or fewer. Letters, digits and @/./+/-/_ only.'),
        validators=[username_validator],
    )
    last_name = models.CharField(_("last name"), max_length=150, blank=True)
    email_verify = models.BooleanField(default=False)
    phone_number = models.CharField(validators=[RegexValidator(regex = r"^\+?1?\d{8,15}$")], max_length=16, unique=True, null=True, blank=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

class BlackListToken(models.Model):
    token = models.CharField(max_length=200)
