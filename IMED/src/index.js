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

  let input_queue = await channel.assertQueue("IMED-in");

  // Makes sure that the messages are persisted even if IMED has not yet started.
  const queue = await channel.assertQueue("IMED-in");
  await channel.bindQueue(queue.queue, EXCHANGE, "compse140.o");

  channel.consume(input_queue.queue, (msg) => {
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

  clearInterval(connectLoop);
}, 1000);
