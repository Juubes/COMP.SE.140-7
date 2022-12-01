import amqplib from "amqplib";
// Initial connection

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
    await channel.assertExchange(EXCHANGE, "topic");
    await channel.assertExchange("state", "fanout");

    // Makes sure that the messages are persisted even if IMED has not yet started.
    const IMEDInQueue = await channel.assertQueue("IMED-in");
    await channel.bindQueue(IMEDInQueue.queue, EXCHANGE, "compse140.o");

    const stateQueue = await channel.assertQueue("state-imed");
    await channel.bindQueue(stateQueue.queue, "state", "state");

    channel.consume(IMEDInQueue.queue, (msg) => {
      // Wait for a second and send to another channel
      setTimeout(() => {
        channel.publish(
          EXCHANGE,
          "compse140.i",
          Buffer.from("Got " + msg.content)
        );

        channel.ack(msg);
      }, 1000);
    });

    channel.consume(
      stateQueue.queue,
      (msg) => updateState(msg.content.toString()),
      { noAck: true }
    );

    clearInterval(connectionLoop);
  }, 1000);
}

/**
 * @param {String} state
 */
export async function updateState(state) {
  switch (state) {
    case "INIT":
      console.log("TODO: INIT");
      break;
    case "PAUSED":
      console.log("TODO: INIT");
      break;
    case "RUNNING":
      console.log("TODO: INIT");
      break;
    case "SHUTDOWN":
      process.exit(0);
      break;
  }
}
