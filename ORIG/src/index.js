import assertAMQPConfiguration from "./rabbitmq.js";

const EXCHANGE = "topic_exchange";

let globalState = "PAUSED";

const channel = await assertAMQPConfiguration();

// Message sending
setInterval(() => {
  if (globalState != "RUNNING") return;

  channel.publish(EXCHANGE, "compse140.o", Buffer.from("MSG_2"), {
    persistent: true,
  });
}, 3000);

/**
 * @param {String} state
 */
export async function updateState(state) {
  switch (state) {
    case "INIT":
      globalState = "RUNNING";
      break;
    case "PAUSED":
      globalState = "PAUSED";
      break;
    case "RUNNING":
      globalState = "RUNNING";
      break;
    case "SHUTDOWN":
      process.exit(0);
      break;
  }
}
