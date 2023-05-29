from cryptography.fernet import Fernet
import base64
from django.conf import settings
import re
from transliterate import translit
import random
import string
from .models import Room

#функция шифрования
def encrypt(txt):
    try:
        txt = str(txt)
        cipher_suite = Fernet(settings.ENCRYPT_KEY)
        encrypted_text = cipher_suite.encrypt(txt.encode('utf-8'))
        encrypted_text = base64.urlsafe_b64encode(encrypted_text).decode("utf-8") 
        return encrypted_text
    except:
        return None


#функция дешифрования
def decrypt(txt):
    try:
        txt = base64.urlsafe_b64decode(txt)
        cipher_suite = Fernet(settings.ENCRYPT_KEY)
        decoded_text = cipher_suite.decrypt(txt).decode("utf-8")   
        return decoded_text
    except:
        return None


#функция генерации уникального имени чата
def generate_unique_name_room(name_chat):
        #функция генерации случайной строки строки
        def generate_random_string(length):
            letters = string.ascii_lowercase
            rand_string = ''.join(random.choice(letters) for i in range(length))
            return rand_string
        #проверяем есть ли русские буквы в названии чата
        def is_cyrrylic(symb):
            return True if u'\u0400' <= symb <=u'\u04FF' or u'\u0500' <= symb <= u'\u052F' else False
        rus = False
        for i in name_chat:
            a = is_cyrrylic(i)
            if a == True:
                rus = True
                break
        #если есть транслитерируем имя
        if rus:
            url_name = translit(name_chat, language_code='ru', reversed=True)
        else:
            url_name = name_chat
        #избавляемся от всего кроме букв и _ (при этом заменяя пробелы на _)
        url_name = url_name.replace('  ', '').replace(' ', '_')
        url_name = re.sub(r'[^A-Za-z_]+', r'', url_name)
        #если строка пулучается слишком маленькой, то генерируем сами
        if len(url_name)<2:
            url_name = generate_random_string(8)
        #создаем неповторяющеесе имя чата добавляя счетчик
        c = 1
        while Room.objects.filter(name=url_name).first() is not None:
            if c == 1:
                url_name = url_name+str(c)
            else:
                url_name = re.sub(r'[^\w\s]+|[\d]+', r'', url_name).strip()+str(c)
            c+=1
        return url_name