FROM node:19

EXPOSE 8080

WORKDIR /app

COPY . /app/

RUN npm ci

ENTRYPOINT node ./src/index.js
