FROM python:2.7

WORKDIR /usr/src/app

COPY requirements.txt ./
RUN pip install -r requirements.txt

# set env variables
ENV CLOSETINN_ENV production

# add our code files to our container
ADD . .

CMD [ "python", "./src/server.py" ]
