FROM node:19

WORKDIR /app

COPY . /app/

RUN npm ci

ENTRYPOINT node ./src/index.js
