const nodemailer = require("nodemailer");
require("dotenv").config();

const { META_PASSWORD } = process.env;

const nodemailerConfig = {
  host: "smtp.meta.ua",
  port: 465,
  secure: true,
  auth: {
    user: "s.klymenko@meta.ua",
    pass: META_PASSWORD,
  },
};

const transport = nodemailer.createTransport(nodemailerConfig);

const email = {
  to: "deyifey655@zamaneta.com",
  from: "s.klymenko@meta.ua",
  subject: "Hello",
  html: "Hello",
};
transport
  .sendMail(email)
  .then(() => console.log("Email send success"))
  .catch((err) => console.log(err.message));
