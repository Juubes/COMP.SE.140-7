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

// setTimeout(async () => {
//   console.log("GET /state == RUNNING");

//   const res = await fetch("http://gateway:8083/state", { method: "GET" });
//   const data = await res.text();
//   if (data != "RUNNING") process.exit(1);
// }, 1000);

setTimeout(async () => {
  console.log("GET /messages");
  const res = await fetch("http://gateway:8083/messages", { method: "GET" });
  const data = await res.text();
  if (!data.match(/\n/)) {
    console.log("No data found");
    process.exit(1);
  }
  console.log(data);
}, 5000);

setTimeout(async () => {
  console.log("PUT /state < SHUTDOWN");
  try {
    // This can fail if the gateway stops synchronously
    await fetch("http://gateway:8083/state", {
      method: "PUT",
      body: "SHUTDOWN",
    });
  } catch (e) {}
}, 6000);

setTimeout(async () => {
  console.log("GET /state fails successfully");
  try {
    // Fails if shutdown worked
    await fetch("http://gateway:8083/state", { method: "GET" });
  } catch (e) {
    process.exitCode = 0;
  }
}, 7000);
