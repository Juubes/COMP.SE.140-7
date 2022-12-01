import express from "express";
import assertAMQPConfiguration from "./rabbitmq.js";

const app = express();

assertAMQPConfiguration();

app.get("/messages", (req, res) => {
  res.setHeader("Content-Type", "text/plain");
});

app.put("/state", (req, res) => {
  channel.publish("state", "state", Buffer.from("STOP"), {
    persistent: true,
  });
});

app.get("/state", (req, res) => {
  res.send("Hello messages");
});
app.get("/run-log", (req, res) => {
  res.send("Hello run log");
});

// Optional
app.get("/node-statistics", (req, res) => {
  res.send("Hello node stats");
});

// Optional
app.get("/queue-statistics", (req, res) => {
  res.send("Hello queue stats");
});

app.listen(8083);
