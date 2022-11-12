FROM node:19

WORKDIR /app

COPY . /app/

RUN mkdir /app/volume

RUN npm ci

ENTRYPOINT node ./src/index.js
