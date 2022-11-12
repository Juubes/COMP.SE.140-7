import amqplib from "amqplib";

const EXCHANGE = "topic_exchange";

// Initial connection
setTimeout(() => {
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

    channel.bindQueue(input_queue.queue, EXCHANGE, "compse140.o");

    channel.consume(input_queue.queue, (msg) => {
      console.log("Consumed: " + msg.content.toString());

      // Wait for a second and send to another channel
      setTimeout(() => {
        channel.publish(EXCHANGE, "compse140.i", msg.content);

        console.log("Received: " + msg.content.toString());

        channel.ack(msg);
      }, 1000);
    });

    clearInterval(connectLoop);
  }, 1000);
}, 10000);
