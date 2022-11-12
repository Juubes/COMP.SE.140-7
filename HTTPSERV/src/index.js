import express from "express";

const app = express();

// Parse body text
app.use(express.text());

app.get("*", async (req, res) => {
  // I'm fetching the data trough HTTP instead of a volume. The requirements don't mind and it's more scalable :-)
  const response = await fetch("http://obse:8080/");
  const data = await response.text();

  res.setHeader("Content-Type", "text/plain");
  res.send(data);
});

app.listen(8080, () => {});
