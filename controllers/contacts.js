const Contact = require("../models/contact");

const { HttpError, controlWrapper } = require("../helpers");

const getAll = async (req, res) => {
  const result = await Contact.find();
  res.json(result);
};

const getById = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findById(contactId);
  if (!result) {
    throw HttpError(404, "Not Found");
  }
  res.json(result);
};

const add = async (req, res) => {
  const result = await Contact.create(req.body);
  res.status(201).json(result);
};

const removeById = async (req, res) => {
  const { contactId } = req.params;
  const result = Contact.findOneAndDelete(contactId);
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

  const result = Contact.findByIdAndUpdate(contactId, req.body);
  if (!result) {
    throw HttpError(404, "Not Found");
  }
  res.json(result);
};

const updateStatusContact = async (req, res) => {
  const { id } = req.params;
  const { favorite } = req.body;

  if (favorite === undefined) {
    throw HttpError(400, "missing field favorite");
  }

  const result = await Contact.findByIdAndUpdate(
    id,
    { favorite },
    { new: true }
  );

  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
};

module.exports = {
  getAll: controlWrapper(getAll),
  getById: controlWrapper(getById),
  add: controlWrapper(add),
  removeById: controlWrapper(removeById),
  updateById: controlWrapper(updateById),
  updateStatusContact: controlWrapper(updateStatusContact),
};
