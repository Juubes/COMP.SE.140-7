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
  const data = fs.readFileSync("/app/volume/data.txt");
  res.send(data);
});

app.listen(80);
