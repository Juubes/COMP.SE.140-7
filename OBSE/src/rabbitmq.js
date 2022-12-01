import fs from "fs";
import amqplib from "amqplib";

const EXCHANGE = "topic_exchange";

// Initial connection
export default function assertAMQPConfiguration() {
  const connectionLoop = setInterval(async () => {
    let res;
    try {
      res = await amqplib.connect("amqp://rabbitmq/");
    } catch (ex) {
      // Cannot connect, retry
      return;
    }

    const channel = await res.createChannel();
    await channel.assertExchange("state", "fanout");
    await channel.assertExchange(EXCHANGE, "topic");

    // Makes sure that the messages are persisted even if services start at different times.
    const imedQueue = await channel.assertQueue("IMED-in");
    const obseQueue = await channel.assertQueue("OBSE-in");
    await channel.bindQueue(imedQueue.queue, EXCHANGE, "compse140.o");
    await channel.bindQueue(obseQueue.queue, EXCHANGE, "#");

    // Make sure all queues for state are initialized
    const stateQueue = await channel.assertQueue("state-obse");
    await channel.bindQueue("state-obse", "state", "state");

    channel.consume(obseQueue.queue, (msg) => processMessage(msg, channel), {
      noAck: true,
    });

    // Get state updates
    channel.consume(
      stateQueue.queue,
      (msg) => processStatusMessage(msg, channel),
      {
        noAck: true,
      }
    );

    clearInterval(connectionLoop);
  }, 1000);
}

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

/**
 * @param {amqplib.ConsumeMessage} msg
 * @param {amqplib.Channel} channel
 */
function processStatusMessage(msg, channel) {
  console.log("TODO: Message received: " + msg.content.toString());
}
