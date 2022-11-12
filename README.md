# AMQP Exercise for COMP.SE.140

## Description

This is a project for a software engineering course. The aim is to learn about messaging between services and cloud native architecture.

The program is a proof of concept about async messaging between four microservices.

## Running

`$ docker-compose up --build -d`

`$ curl localhost:8080`

The software has been developed for

`Docker version 20.10.12, build 20.10.12-0ubuntu4`

`docker-compose version 1.29.2`

`Linux Ubuntu/PopOS 22.04`

## Learning outcomes

Most of my time was spent on figuring out the correct AMQP-achitecture. I never used topics before.

One of the most interesting things was to figure out how to stop the messages from disappearing. This was because the sending service sent the messages before the queues had been created. My solution was to assert the structure -- and queues -- from the start of each service.

## Benefits of AMQP compared to HTTP

The queueing could have been accomplished by building the queue system in one or more of the microservices. However by using AMQP it brings a few benefits like routing, security and reliability.
