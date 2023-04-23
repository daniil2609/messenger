FROM python:3.9.6-alpine

# set work directory
WORKDIR /project

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# install dependencies
RUN pip install --upgrade pip
COPY ./backend/requirements.txt /project/backend/requirements.txt
RUN pip install -r /project/backend/requirements.txt

# copy project
COPY . /project

EXPOSE 8000