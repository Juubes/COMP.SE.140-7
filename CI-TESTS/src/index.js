async function assertConnection() {
  return new Promise((resolve, reject) => {
    async function retry() {
      try {
        const res = await fetch("http://gateway:8083/state");
      } catch (e) {
        return setTimeout(() => {
          console.log("Retrying connection");
          retry();
        }, 1000);
      }

      resolve();
    }
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
  console.log("GET /state < ");
  try {
    // Fails if shutdown worked
    await fetch("http://gateway:8083/state", { method: "GET" });
  } catch (e) {
    process.exitCode = 0;
  }
}, 21000);
