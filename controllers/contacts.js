const contacts = require("../models/contacts");

const { HttpError, controlWrapper } = require("../helpers");

const getAll = async (req, res) => {
  const result = await contacts.listContacts();
  res.json(result);
};

const getById = async (req, res) => {
  const { contactId } = req.params;
  const result = await contacts.getContactById(contactId);
  if (!result) {
    throw HttpError(404, "Not Found");
  }
  res.json(result);
};

const add = async (req, res) => {
  const result = await contacts.addContact(req.body);
  res.status(201).json(result);
};

const removeById = async (req, res) => {
  const { contactId } = req.params;
  const result = contacts.removeContact(contactId);
  if (!result) {
    throw HttpError(404, "Not Found");
  }
  res.json({
    message: "Delete success",
  });
};

const updateById = async (req, res) => {
  const { contactId } = req.params;
  const { name, email, phone } = req.body;

  if (!name && !email && !phone) {
    return res.status(400).json({ message: "missing fields" });
  }

  const result = contacts.updateContacts(contactId, req.body);
  if (!result) {
    throw HttpError(404, "Not Found");
  }
  res.json(result);
};

module.exports = {
  getAll: controlWrapper(getAll),
  getById: controlWrapper(getById),
  add: controlWrapper(add),
  removeById: controlWrapper(removeById),
  updateById: controlWrapper(updateById),
};
