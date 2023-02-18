const { gql, GraphQLClient } = require("graphql-request");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const port = 3000 || process.env.PORT;
const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");
const app = express();

dotenv.config();

const clientGraph = new GraphQLClient(process.env.GRAPH_API, {
  headers: {
    authorization: "Bearer " + process.env.GRAPH_TOKEN,
  },
});

app.use(cors());
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

  try {
    const { client } = await clientGraph.request(query);

    if (client.id !== null) {
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
    } else {
      res.send("Invalid Token");
    }
  } catch (error) {
    res.send("Invalid Token");
  }
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
  try {
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

    // send email

    transporter.sendMail(mailOptions, function (err, info) {
      console.log("Sending mail");
      if (err) {
        console.log(err);
        res.send("Error");
      } else {
        res.send("Success");
      }
    });
    res.send("Success");
  } catch (error) {
    res.send("Error");
  }
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
    const { deleteClient } = await clientGraph.request(query);
    deleteClient.id
      ? res.send("Token deleted successfully!")
      : res.send("Invalid Token");
  } catch (error) {
    res.send("Invalid Token"); // runs if token is invalid
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
