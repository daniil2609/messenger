#! /bin/bash

python project/manage.py makemigrations --no-input

python project/manage.py migrate --no-input

python project/manage.py collectstatic --no-input

python project/manage.py runserver 0.0.0.0:8000
#uvicorn --host 0.0.0.0 --port 8000 core.asgi:application --reload