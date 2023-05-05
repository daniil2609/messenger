FROM python:3.9

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBEFFERED 1

RUN apt-get update && apt-get upgrade -y && apt-get install -y build-essential daphne

RUN apt-get install -y tzdata
ENV TZ Europe/Moscow
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN mkdir /core

WORKDIR /core

# COPY groups.json .
COPY requirements.txt .
COPY entrypoint.sh .
RUN pip install --upgrade pip
RUN pip install -r requirements.txt
RUN chmod +x entrypoint.sh

COPY . .


# ENTRYPOINT ["/core/entrypoint.sh"]