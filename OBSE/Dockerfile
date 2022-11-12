FROM node:latest


WORKDIR /app

COPY . /app/

RUN mkdir /app/volume

RUN chown -R daemon:daemon /app

USER daemon

ENTRYPOINT node ./src/index.js
