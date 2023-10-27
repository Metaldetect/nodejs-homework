const { Schema, model } = require("mongoose");
const Joi = require("joi");
const { handleMongooseError } = require("../helpers");
const validateEmailRegex = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zAZ0-9]+$/;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      match: validateEmailRegex,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      minlength: 6,
      required: true,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    token: {
      type: String,
      default: "",
    },
    avatarURL: {
      type: String,
      require: true,
    },
  },
  { versionKey: false, timestamps: true }
);

const registerSchema = Joi.object({
  name: Joi.string().required(),
  password: Joi.string().min(6).required(),
  email: Joi.string().pattern(validateEmailRegex).required(),
});

const loginSchema = Joi.object({
  password: Joi.string().min(6).required(),
  email: Joi.string().pattern(validateEmailRegex).required(),
});

const emailSchema = Joi.object({
  email: Joi.string().required(),
});

const schemas = { registerSchema, loginSchema, emailSchema };

userSchema.post("save", handleMongooseError);

const User = model("user", userSchema);

module.exports = { User, schemas };
