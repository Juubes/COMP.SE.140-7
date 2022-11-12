# AMQP Exercise for COMP.SE.140

## Description

This is a project for a software engineering course. The aim is to learn about messaging between services and cloud native architecture.

The program is a proof of concept about async messaging between four microservices.

## Running

`$ docker-compose up --build -d`

`$ curl localhost:8080`

## Learning outcomes

Most of my time was spent on figuring out the correct AMQP-achitecture. I never used topics before.

One of the most interesting things was to figure out how to stop the messages from disappearing. This was because the sending service sent the messages before the queues had been created. My solution was to assert the structure -- and queues -- from the start of each service.
