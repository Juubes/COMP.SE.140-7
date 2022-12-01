import amqplib from "amqplib";

const EXCHANGE = "topic_exchange";

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
    await channel.assertExchange(EXCHANGE, "topic", { durable: true });

    // Makes sure that the messages are persisted even if services start at different times.
    const imedQueue = await channel.assertQueue("IMED-in");
    const obseQueue = await channel.assertQueue("OBSE-in");
    await channel.bindQueue(imedQueue.queue, EXCHANGE, "compse140.o");
    await channel.bindQueue(obseQueue.queue, EXCHANGE, "#");

    // Make sure all queues for state are initialized
    const stateQueue = await channel.assertQueue("state-orig");
    await channel.bindQueue("state-orig", "state", "state");

    // Get state updates
    channel.consume(stateQueue.queue, (msg) => processMessage(msg, channel), {
      noAck: true,
    });

    clearInterval(connectionLoop);
  }, 1000);
}
const processMessage = (msg, channel) => {
  console.log("TODO: Message received: " + msg.content.toString());
};
