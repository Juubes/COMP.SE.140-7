import express from "express";
import assertAMQPConfiguration from "./rabbitmq.js";

const app = express();

const channel = await assertAMQPConfiguration();

let globalState = "PAUSED";

const startTime = new Date();

/**@type {String[]} */
let runlog = [];

export function changeState(state) {
  if (state == "INIT") globalState = "RUNNING";
  else globalState = state;
}

// Parse body
app.use(express.text());

app.get("/messages", async (req, res) => {
  const result = await fetch("http://obse/");
  const data = await result.text();

  res.setHeader("Content-Type", "text/plain");
  res.send(data);
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

  runlog.push(`${new Date().toISOString()}: ${state}`);

  await channel.publish("state", "state", Buffer.from(state));

  res.sendStatus(200);
});

app.get("/state", (req, res) => {
  res.send(globalState);
});
app.get("/run-log", (req, res) => {
  res.send(runlog.join("\n"));
});

// Optional
app.get("/node-statistics", (req, res) => {
  res.send({
    stateChanges: runlog.length,
    uptime: Date.now() - startTime,
  });
});

// Optional
app.get("/queue-statistics", (req, res) => {
  res.send({ error: "queue-statistics not implemented" });
});

app.listen(8083);
