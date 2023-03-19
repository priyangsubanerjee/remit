const express = require("express");
const app = express();
const port = 3005 || process.env.PORT;
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const { gql, GraphQLClient } = require("graphql-request");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");

dotenv.config();

const graphClient = new GraphQLClient(process.env.GRAPH_API, {
  headers: {
    authorization: "Bearer " + process.env.GRAPH_TOKEN,
  },
});

app.use(
  cors({
    origin: "*",
    methods: "GET,PUT,POST,DELETE,OPTIONS".split(","),
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

app.post("/create", async (req, res) => {
  const { name, email, password } = req.body;

  const query = gql`
    mutation MyMutation {
      createClient(data: { name: "${name}", email: "${email}", password: "${password}" }) {
        id
      }
    }
  `;

  try {
    const { createClient } = await graphClient.request(query);
    if (createClient.id) {
      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASS,
        },
      });
      var options = {
        from: `Remit API <${process.env.EMAIL}>`,
        to: email,
        subject: "Welcome to Remit API",
        html: `<h1>Welcome to Remit API</h1>
          <p>Hi ${name},</p>    
          <p>Thank you for registering with Remit API. We are glad to have you on board.</p>
          <p>Your api token is: ${createClient.id}</p>
          <p>Regards,</p>
          <p>Remit API</p>
          <br>
          <br>
          <a href="https://remitapi.vercel.app/delete/${createClient.id}">Delete this token</a>
          <br>
          <p>Disclaimer: This is an auto-generated email. Please do not reply to this email.</p>
          `,
      };
      transporter.sendMail(options, function (err, info) {
        if (err) {
          console.log(err);
          res.status(400).send({ message: "Email not sent !" });
        } else {
          res
            .status(200)
            .send({ message: "User created & email sent successfully" });
        }
      });
    } else {
      res.status(400).send({ message: "User not created" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: "User not created" });
  }
});

app.post("/send/:id", async (req, res) => {
  const { id } = req.params;
  const { to, html, text, subject } = req.body;

  const query = gql`
    query MyQuery {
      client(where: { id: "${id}" }) {
        name
        password
        email
        id
      }
    }
  `;

  try {
    const { client } = await graphClient.request(query);
    if (client.id) {
      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: client.email,
          pass: client.password,
        },
      });
      var options = {
        from: `${client.name} <${client.email}>`,
        to,
        subject,
        html,
        text,
      };
      transporter.sendMail(options, function (err, info) {
        if (err) {
          console.log(err);
          res.status(400).send({ message: "Email not sent !" });
        } else {
          res.status(200).send({ message: "Email sent successfully" });
        }
      });
    } else {
      res.status(400).send({ message: "Token not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: "Token not found" });
  }
});

app.get("/delete/:id", async (req, res) => {
  const { id } = req.params;
  const query = gql`
        mutation MyMutation {
        deleteClient(where: {id: "${id}"}) {
            id
        }
        }
    `;

  try {
    const { deleteClient } = await graphClient.request(query);
    if (deleteClient.id) {
      res.sendFile(path.join(__dirname, "public", "success.html"));
    } else {
      res.status(400).send({ message: "Token not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: "Token not found" });
  }
});

app.get("/documentation", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "documentation.html"));
});

app.get("/send/demo/:sentBy", async (req, res) => {
  const { sentBy } = req.params || "Remit API";
  const id = "clead0agx2onc0a1hl7ia4j1p";
  const to = "priyangsu26@gmail.com";
  const html = `<p>Hi Priyangsu,</p>
                <p>Thank you for registering with Remit API. We are glad to have you on board.</p>
                <p>Your api token is: ${id}</p>
                <p>Regards,</p>
                <p>Remit API</p>
                <br>
                <br>
                <p>Sent by: ${sentBy}</p>
                <br>
            `;
  const text = `Welcome to Remit API`;
  const subject = `Welcome to Remit API`;

  const query = gql`
    query MyQuery {
      client(where: { id: "${id}" }) {
        name
        password
        email
        id
      }
    }
  `;

  try {
    const { client } = await graphClient.request(query);
    if (client.id) {
      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: client.email,
          pass: client.password,
        },
      });
      var options = {
        from: `${client.name} <${client.email}>`,
        to,
        subject,
        html,
        text,
      };
      transporter.sendMail(options, function (err, info) {
        if (err) {
          console.log(err);
          res.status(400).send({ message: "Email not sent !" });
        } else {
          res.status(200).send({ message: "Email sent successfully" });
        }
      });
    } else {
      res.status(400).send({ message: "Token not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: "Token not found" });
  }
});

app.listen(port, () => {
  console.log(`Node app listening at http://localhost:${port}`);
});
