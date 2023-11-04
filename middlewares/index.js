const validateBody = require("./validateBody");
const authenticate = require("./authenticate");
const isValidId = require("./isValidId");
const checkBody = require("./checkBody");
const upload = require("./upload");
const sendMail = require("./sendMail");

module.exports = {
  validateBody,
  authenticate,
  isValidId,
  checkBody,
  upload,
  sendMail,
};
