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
  await channel.assertExchange(EXCHANGE, "topic", { durable: true });

  // Makes sure that the messages are persisted even if services start at different times.
  const imedQueue = await channel.assertQueue("IMED-in");
  const obseQueue = await channel.assertQueue("OBSE-in");
  await channel.bindQueue(imedQueue.queue, EXCHANGE, "compse140.o");
  await channel.bindQueue(obseQueue.queue, EXCHANGE, "#");

  setTimeout(
    () =>
      channel.publish(EXCHANGE, "compse140.o", Buffer.from("MSG_1"), {
        persistent: true,
      }),
    0
  );
  setTimeout(
    () =>
      channel.publish(EXCHANGE, "compse140.o", Buffer.from("MSG_2"), {
        persistent: true,
      }),
    1 * 3000
  );
  setTimeout(
    () =>
      channel.publish(EXCHANGE, "compse140.o", Buffer.from("MSG_3"), {
        persistent: true,
      }),
    2 * 3000
  );

  clearInterval(connectLoop);
}, 1000);
