const { gql, GraphQLClient } = require("graphql-request");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");
const app = express();
const port = 3000 || process.env.PORT;

dotenv.config();

const clientGraph = new GraphQLClient(process.env.GRAPH_API, {
  headers: {
    authorization: "Bearer " + process.env.GRAPH_TOKEN,
  },
});

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use("/", express.static(path.join(__dirname, "public")));

// POST /send/:clientId to send email using remit API

app.post("/send/:id", async (req, res) => {
  const { id } = req.params;
  const { subject, text, to, html } = req.body;

  const query = gql`
    query MyQuery {
      client(where: { id: "${id}" }) {
        name
        password
        email
      }
    }
  `;

  const { client } = await clientGraph.request(query);

  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: client.email,
      pass: client.password,
    },
  });

  const mailOptions = {
    from: `${client.name} <${client.email}>`,
    to: to,
    subject: subject || "No Subject",
    text: text || "",
    html: html || "",
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

// POST /create to create a new client using remit API

app.post("/create", async (req, res) => {
  const { email, password, name } = await req.body;

  const query = gql`
    mutation MyMutation {
      createClient(data: { name: "${name}", email: "${email}", password: "${password}" }) {
        id
      }
    }
  `;

  // create client

  const { createClient } = await clientGraph.request(query);
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS,
    },
  });

  // send email confirmation

  const mailOptions = {
    from: `Remit Token <${process.env.EMAIL}>`,
    to: email,
    subject: "Welcome to Remit API",
    html: `<h1>Welcome to Remit API</h1>
      <p>Here is your token: ${createClient.id}</p>
      <p>Use this token to send emails using Remit API</p>
      <p>Thank you</p>
      
      <a href="https://remitapi.vercel.app/delete/${createClient.id}">Delete Token</a>`,
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

app.get("/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const query = gql`
          mutation MyMutation {
            deleteClient(where: { id: "${id}" }) {
              id
            }
          }
        `;
    await clientGraph.request(query);
    res.send("Token deleted successfully!");
  } catch (error) {
    res.send("Invalid Token"); // runs if token is invalid
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
