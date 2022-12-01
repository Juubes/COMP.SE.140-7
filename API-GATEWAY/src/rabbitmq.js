import amqplib from "amqplib";

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
    channel.consume(gatewayQueue.queue, (msg) => processMessage(msg, channel), {
      noAck: true,
    });

    clearInterval(connectionLoop);
  }, 1000);
}

function processMessage(msg, channel) {
  console.log("TODO: Message received: " + msg.content);
}
