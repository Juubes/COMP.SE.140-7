import amqplib from "amqplib";
import assertAMQPConfiguration from "./rabbitmq.js";

const channel = await assertAMQPConfiguration();

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
