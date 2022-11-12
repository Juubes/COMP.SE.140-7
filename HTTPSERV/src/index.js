import axios from "axios";
import bodyParser from "body-parser";
import express from "express";

const app = express();

// Parse body text
app.use(express.text());

app.get("*", async (req, res) => {
  const response = await fetch("http://obse:8080/");
  const data = await response.text();

  res.setHeader("Content-Type", "text/plain");
  res.send(data);
});

app.listen(8080, () => {});
