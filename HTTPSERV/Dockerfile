FROM node:19

EXPOSE 8080

WORKDIR /app

COPY ./package-lock.json ./package.json /app/

RUN npm ci

COPY . /app/


ENTRYPOINT node ./src/index.js
