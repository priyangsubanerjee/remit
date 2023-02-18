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
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  })
);
app.use(bodyParser.json());
app.use("/", express.static(path.join(__dirname, "public")));

// POST /send/:clientId to send email using remit API

app.post("/send/:clientId", async (req, res) => {
  const { clientId } = req.params;

  const query = gql`
    query MyQuery {
      client(where: { id: "${clientId}" }) {
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

  const { subject, text, to, html } = req.body;
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
  console.log(query);
  const { createClient } = await clientGraph.request(query);
  res.send(createClient);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
