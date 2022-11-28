FROM node:19

EXPOSE 8080

WORKDIR /app

COPY . /app/

RUN mkdir /app/volume

RUN npm ci

ENTRYPOINT node ./src/index.js
