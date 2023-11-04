const { User } = require("../models/user");
const { HttpError, controlWrapper } = require("../helpers");
const path = require("path");
const fs = require("fs/promises");
const gravatar = require("gravatar");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { SECRET_KEY, META_PASSWORD, BASE_URL } = process.env;
const avatarsDir = path.join(__dirname, "../", "public", "avatars");
const Jimp = require("jimp");
const nodemailer = require("nodemailer");
const { nanoid } = require("nanoid");

const sendVerificationEmail = async (to, verificationToken) => {
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
    to: to,
    subject: "Verify your email",
    html: `<a target="blank" href="${BASE_URL}/api/user/verify/${verificationToken}">Verify your email</a>`,
  };

  await transport.sendMail(email);
};

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, "Email in use");
  }

  const createHashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url("email");
  const verificationToken = nanoid();

  const newUser = await User.create({
    ...req.body,
    password: createHashPassword,
    avatarURL,
    verificationToken,
  });

  await sendVerificationEmail(email, verificationToken);

  res.status(201).json({
    name: newUser.name,
    email: newUser.email,
  });
};

const verifyEmail = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });
  if (!user) {
    throw HttpError(404, "Email not found");
  }
  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: "",
  });
  res.json({
    message: "Email verified",
  });
};

const resendVerifyEmail = async (req, res) => {
  const email = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(404, "Email not found");
  }
  if (user.verify) {
    throw HttpError(400, "Email already verified");
  }
  const verifyEmail = {
    to: email,
    subject: "Verify your email",
    html: `<a target="blank" href="${BASE_URL}/api/user/verify/${user.verificationToken}">Verify your email</a>`,
  };
  await sendVerificationEmail(email, verifyEmail);
  res.json({
    message: "Email resent",
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password invalid");
  }

  if (!user.verify) {
    throw HttpError(401, "Email not verifying");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password invalid");
  }

  const payload = {
    id: user._id,
  };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "24h" });
  await User.findByIdAndUpdate(user._id, { token });

  res.json({
    token,
  });
};

const getCurrent = async (req, res) => {
  const { email, name } = req.user;
  res.json({
    email,
    name,
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate({ _id, token: "" });

  res.json({
    message: "Logout success",
  });
};

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: tempUpload, originalname } = req.file;
  const image = await Jimp.read(tempUpload);
  await image.cover(250, 250).writeAsync(tempUpload);
  const filename = `${_id}_${originalname}`;
  const resultUpload = path.join(avatarsDir, filename);
  await fs.rename(tempUpload, resultUpload);
  const avatarURL = path.join("avatars", filename);
  await User.findByIdAndUpdate(_id, { avatarURL });

  res.status(200).json({
    avatarURL,
  });
};
module.exports = {
  register: controlWrapper(register),
  sendVerificationEmail: controlWrapper(sendVerificationEmail),
  verifyEmail: controlWrapper(verifyEmail),
  resendVerifyEmail: controlWrapper(resendVerifyEmail),
  login: controlWrapper(login),
  getCurrent: controlWrapper(getCurrent),
  logout: controlWrapper(logout),
  updateAvatar: controlWrapper(updateAvatar),
};
