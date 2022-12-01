import express from "express";
import amqplib from "amqplib";
import fs from "fs";
import assertAMQPConfiguration from "./rabbitmq.js";

const app = express();

assertAMQPConfiguration();

if (fs.existsSync("/app/volume/data.txt")) {
  fs.unlinkSync("/app/volume/data.txt");
}

// HTTP route to get the file contents
app.get("/", (req, res) => {
  if (!fs.existsSync("/app/volume/data.txt")) {
    res.send("");
    return;
  }
  res.send(fs.readFileSync("/app/volume/data.txt"));
});

app.listen(8080);
