import amqplib from "amqplib";

const EXCHANGE = "topic_exchange";
const ROUTING_KEY = "compse140.o";

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
  await channel.assertExchange(EXCHANGE, "topic", { durable: true });

  const queue = await channel.assertQueue("IMED-in");
  await channel.bindQueue(queue.queue, EXCHANGE, ROUTING_KEY);

  setTimeout(
    () =>
      channel.publish(EXCHANGE, ROUTING_KEY, Buffer.from("MSG_1"), {
        persistent: true,
      }),
    0
  );
  setTimeout(
    () =>
      channel.publish(EXCHANGE, ROUTING_KEY, Buffer.from("MSG_2"), {
        persistent: true,
      }),
    0 * 3000
  );
  setTimeout(
    () =>
      channel.publish(EXCHANGE, ROUTING_KEY, Buffer.from("MSG_3"), {
        persistent: true,
      }),
    0 * 3000
  );

  clearInterval(connectLoop);
}, 1000);
