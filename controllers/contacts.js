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

  const currentContact = await contacts.getContactById(contactId);

  if (!currentContact) {
    throw HttpError(404, "Not Found");
  }

  if (name !== undefined) {
    currentContact.name = name;
  }

  if (email !== undefined) {
    currentContact.email = email;
  }

  if (phone !== undefined) {
    currentContact.phone = phone;
  }

  const result = contacts.updateContacts(contactId, currentContact);

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
