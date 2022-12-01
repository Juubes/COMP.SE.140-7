import express from "express";
import assertAMQPConfiguration from "./rabbitmq.js";

const app = express();

const channel = await assertAMQPConfiguration();

// Parse body
app.use(express.text());

app.get("/messages", (req, res) => {
  res.setHeader("Content-Type", "text/plain");
});

app.put("/state", async (req, res) => {
  const state = req.body;

  // Validate
  switch (state) {
    case "INIT":
    case "PAUSED":
    case "RUNNING":
    case "SHUTDOWN":
      break;
    default:
      res.sendStatus(400);
      return;
  }

  await channel.publish("state", "state", Buffer.from(state));

  res.sendStatus(200);
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
