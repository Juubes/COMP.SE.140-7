const MAX_CONNECTION_TRIES = 20;
async function assertConnection() {
  let count = 0;
  return new Promise((resolve, reject) => {
    async function retry() {
      if (count > MAX_CONNECTION_TRIES) process.exit(1);
      try {
        await fetch("http://gateway:8083/state");
      } catch (e) {
        return setTimeout(() => {
          console.log("Retrying connection");
          retry();
        }, 1000);
      }

      resolve();
    }
    count++;
    retry();
  });
}

await assertConnection();

// Init
console.log("PUT /state < INIT");
await fetch("http://gateway:8083/state", { method: "PUT", body: "INIT" });

setTimeout(async () => {
  console.log("GET /state == RUNNING");

  const res = await fetch("http://gateway:8083/state", { method: "GET" });
  const data = await res.text();
  if (data != "RUNNING") process.exit(1);
}, 1000);

setTimeout(async () => {
  console.log("GET /state == RUNNING");

  const res = await fetch("http://gateway:8083/state", { method: "GET" });
  const data = await res.text();
  if (data != "RUNNING") process.exit(1);
}, 1000);

setTimeout(async () => {
  console.log("GET /messages");
  const res = await fetch("http://gateway:8083/messages", { method: "GET" });
  const data = await res.text();
  console.log(data);
}, 5000);

setTimeout(async () => {
  console.log("PUT /state < SHUTDOWN");
  await fetch("http://gateway:8083/state", {
    method: "PUT",
    body: "SHUTDOWN",
  });
}, 20000);

setTimeout(async () => {
  console.log("GET /state fails");
  try {
    // Fails if shutdown worked
    await fetch("http://gateway:8083/state", { method: "GET" });
  } catch (e) {
    process.exitCode = 0;
  }
}, 21000);
