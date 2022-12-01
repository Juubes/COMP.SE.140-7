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
await fetch("http://gateway:8083/state", { method: "PUT", body: "INIT" });

setTimeout(async () => {
  const res = await fetch("http://gateway:8083/state", { method: "GET" });
  const data = await res.text();
  if (data != "RUNNING") process.exit(1);
}, 1000);

setTimeout(async () => {
  const res = await fetch("http://gateway:8083/state", { method: "GET" });
  const data = await res.text();
  if (data != "RUNNING") process.exit(1);
}, 5000);

setTimeout(async () => {
  const res = await fetch("http://gateway:8083/state", {
    method: "PUT",
    body: "SHUTDOWN",
  });
}, 20000);

setTimeout(async () => {
  try {
    const res = await fetch("http://gateway:8083/state", { method: "GET" });
    const data = res.text();
    console.log(data);
  } catch (e) {}
}, 21000);
