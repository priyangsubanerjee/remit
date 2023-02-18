const express = require("express");
const app = express();
const port = 3000 || process.env.PORT;
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");

app.use(
  cors({
    origin: "*",
    methods: "GET,PUT,POST,DELETE,OPTIONS".split(","),
    credentials: true,
  })
);
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "public")));

app.post("/create", (req, res) => {
  const { name, email, password } = req.body;
  res.json({
    name,
    email,
    password,
  });
});

app.listen(port, () => {
  console.log(`Node app listening at http://localhost:${port}`);
});
