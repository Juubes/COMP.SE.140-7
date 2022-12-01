import amqplib from "amqplib";
import { changeState } from "./index.js";

// Initial connection
/**
 * @returns {Promise<amqplib.Channel>}
 */
export default async function assertAMQPConfiguration() {
  return new Promise(async (resolve, reject) => {
    const retry = async () => {
      let res;
      try {
        res = await amqplib.connect("amqp://rabbitmq/");
      } catch (ex) {
        // Cannot connect, retry
        setTimeout(retry, 1000);
        return;
      }

      const channel = await res.createChannel();
      await channel.assertExchange("state", "fanout");

      // Make sure all queues for state are initialized
      const [httpservQueue, gatewayQueue, imedQueue, obseQueue, origQueue] =
        await Promise.all([
          channel.assertQueue("state-httpserv", { durable: true }),
          channel.assertQueue("state-gateway", { durable: true }),
          channel.assertQueue("state-imed", { durable: true }),
          channel.assertQueue("state-obse", { durable: true }),
          channel.assertQueue("state-orig", { durable: true }),
        ]);

      await Promise.all([
        channel.bindQueue(httpservQueue.queue, "state", "state"),
        channel.bindQueue(gatewayQueue.queue, "state", "state"),
        channel.bindQueue(imedQueue.queue, "state", "state"),
        channel.bindQueue(obseQueue.queue, "state", "state"),
        channel.bindQueue(origQueue.queue, "state", "state"),
      ]);

      // Get state updates
      channel.consume(
        gatewayQueue.queue,
        (msg) => processStateChange(msg, channel),
        {
          noAck: true,
        }
      );

      resolve(channel);
    };
    retry();
  });
}

function processStateChange(msg, channel) {
  changeState(msg.content.toString());
  if (msg.content.toString() == "SHUTDOWN") process.exit(0);
}
