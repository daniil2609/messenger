from cryptography.fernet import Fernet
import base64
from django.conf import settings

def encrypt(txt):
    try:
        txt = str(txt)
        cipher_suite = Fernet(settings.ENCRYPT_KEY)
        encrypted_text = cipher_suite.encrypt(txt.encode('utf-8'))
        encrypted_text = base64.urlsafe_b64encode(encrypted_text).decode("utf-8") 
        return encrypted_text
    except:
        return None

def decrypt(txt):
    try:
        txt = base64.urlsafe_b64decode(txt)
        cipher_suite = Fernet(settings.ENCRYPT_KEY)
        decoded_text = cipher_suite.decrypt(txt).decode("utf-8")   
        return decoded_text
    except:
        return None
