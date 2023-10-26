const { Contact } = require("../models/contact");
const { HttpError, controlWrapper } = require("../helpers");

const getAll = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 20 } = req.query;
  const skip = (page - 1) * limit;
  const result = await Contact.find({ owner }, "-createdAt -updatedAt", {
    skip,
    limit,
  }).populate("owner", "name email");
  res.json(result);
};

const findContact = async (contactId, owner) => {
  return await Contact.findOne({ _id: contactId, owner });
};

const getById = async (req, res) => {
  const { contactId } = req.params;
  const { _id: owner } = req.user;
  const contact = await findContact(contactId, owner);
  if (!contact) {
    throw HttpError(404, "Not Found");
  }
  res.json(contact);
};

const add = async (req, res) => {
  const { _id: owner } = req.user;
  const result = await Contact.create({ ...req.body, owner });
  res.status(201).json(result);
};

const removeById = async (req, res) => {
  const { contactId } = req.params;
  const { _id: owner } = req.user;
  const contact = await findContact(contactId, owner);
  if (!contact) {
    throw HttpError(404, "Not Found");
  }

  const result = await Contact.findByIdAndDelete(contactId);
  res.json({
    message: "Delete success",
    deletedContact: result,
  });
};

const updateById = async (req, res) => {
  const { contactId } = req.params;
  const { name, email, phone } = req.body;
  const { _id: owner } = req.user;
  const contact = await findContact(contactId, owner);

  if (!contact) {
    throw HttpError(404, "Not Found");
  }

  if (!name && !email && !phone) {
    return res.status(400).json({ message: "missing fields" });
  }

  const result = await Contact.findByIdAndUpdate(contactId, req.body);
  res.json(result);
};

const updateStatusContact = async (req, res) => {
  const { id } = req.params;
  const { favorite } = req.body;
  const { _id: owner } = req.user;
  const contact = await findContact(id, owner);

  if (!contact) {
    throw HttpError(404, "Not Found");
  }

  if (favorite === undefined) {
    throw HttpError(400, "missing field favorite");
  }

  const result = await Contact.findByIdAndUpdate(
    id,
    { favorite },
    { new: true }
  );
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
