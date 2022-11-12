import fs from "fs";
import amqplib from "amqplib";

const EXCHANGE = "topic_exchange";

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

  // Listen to all queues on exchange
  const queue = await channel.assertQueue("", { exclusive: true });
  await channel.bindQueue(queue.queue, EXCHANGE, "#");

  console.log("Connected.");

  channel.consume(queue.queue, (msg) => processMessage(msg, channel), {
    noAck: true,
  });

  clearInterval(connectLoop);
}, 1000);

/**
 * @param {amqplib.ConsumeMessage} msg
 * @param {amqplib.Channel} channel
 */
function processMessage(msg, channel) {
  fs.appendFileSync("/app/data.txt", msg.content.toString());

  console.log(
    "Written data: " + msg.content.toString() + " from " + msg.fields.routingKey
  );
}
