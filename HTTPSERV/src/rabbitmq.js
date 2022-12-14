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
    const stateQueue = await channel.assertQueue("state-httpserv");
    await channel.bindQueue("state-httpserv", "state", "state");

    // Get state updates
    channel.consume(
      stateQueue.queue,
      (msg) => processStateUpdate(msg, channel),
      {
        noAck: true,
      }
    );

    clearInterval(connectionLoop);
  }, 1000);
}
const processStateUpdate = (msg, channel) => {
  if (msg.content.toString() == "SHUTDOWN") process.exit(0);
};
