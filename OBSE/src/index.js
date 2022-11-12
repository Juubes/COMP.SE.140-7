import express from "express";
import fs from "fs";
import amqplib from "amqplib";

const app = express();

const EXCHANGE = "topic_exchange";

if (fs.existsSync("/app/volume/data.txt")) {
  fs.unlinkSync("/app/volume/data.txt");
}

// Initial connection
const connectLoop = setInterval(async () => {
  let res;

  try {
    res = await amqplib.connect("amqp://rabbitmq/");
  } catch (ex) {
    // Cannot connect, retry
    return;
  }

  const channel = await res.createChannel();
  await channel.assertExchange(EXCHANGE, "topic");

  // Makes sure that the messages are persisted even if services start at different times.
  const imedQueue = await channel.assertQueue("IMED-in");
  const obseQueue = await channel.assertQueue("OBSE-in");
  await channel.bindQueue(imedQueue.queue, EXCHANGE, "compse140.o");
  await channel.bindQueue(obseQueue.queue, EXCHANGE, "#");

  channel.consume(obseQueue.queue, (msg) => processMessage(msg, channel), {
    noAck: true,
  });

  clearInterval(connectLoop);
}, 1000);

let count = 1;
/**
 * @param {amqplib.ConsumeMessage} msg
 * @param {amqplib.Channel} channel
 */
function processMessage(msg, channel) {
  const msgData = msg.content.toString();

  const data = `${new Date().toISOString()} ${count++} ${msgData} to ${
    msg.fields.routingKey
  }\n`;

  fs.appendFileSync("/app/volume/data.txt", data);
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
