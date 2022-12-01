import amqplib from "amqplib";
import assertAMQPConfiguration from "./rabbitmq.js";

const channel = await assertAMQPConfiguration();

/**
 *
 * @param {String} state
 */
export async function updateState(state) {
  switch (state) {
    case "STOP":
      process.exit(0);
      break;
  }
}
