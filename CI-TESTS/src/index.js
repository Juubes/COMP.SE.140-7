const poll = async () => {
  const res = await fetch("http://HTTPSERV:8080/");
  const data = await res.text();

  console.log("Tested. Data: ");
  console.log(data);

  const lines = data.split("\n");

  // Doesn't test the dates
  const result = lines.some((line) => {});
  if (result) {
    console.log("Correct data");
  }
};

setInterval(poll, 1000);
