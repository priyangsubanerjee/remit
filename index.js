const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const path = require("path");
const dotenv = require("dotenv");
const { gql, GraphQLClient } = require("graphql-request");

dotenv.config();

const client = new GraphQLClient(process.env.GRAPH_API, {
  headers: {
    authorization: "Bearer " + process.env.GRAPH_TOKEN,
  },
});

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "virtualbasecorp@gmail.com",
    pass: "wvqhwgbjfpwwirry",
  },
});

app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  })
);

app.use(bodyParser.json());

app.use("/", express.static(path.join(__dirname, "public")));

app.post("/send/:clientId", (req, res) => {
  const { clientId } = req.params;
  const { name, subject, text, to, html } = req.body;
  const mailOptions = {
    from: `Secret confession <virtualbasecorp@gmail.com>`,
    to: to,
    subject: subject,
    text: text,
    html: html,
  };
  transporter.sendMail(mailOptions, function (err, info) {
    console.log("Sending mail");
    if (err) {
      console.log(err);
      res.send("Error");
    } else {
      res.send("Success");
    }
  });
});

app.post("/create", async (req, res) => {
  const { email, pasword, name } = req.body;
  const query = gql`
    mutation MyMutation {
      createClient(data: { name: "", email: "", password: "" }) {
        id
      }
    }
  `;
  const { createClient } = await client.request(query);
  res.send(createClient);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
