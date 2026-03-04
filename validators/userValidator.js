const joi = require("joi");

const signupSchema = joi.object({
  username: joi.string().required(),

  email: joi.string().email().required(),

  password: joi.string().min(6).required(),

  role: joi.string().valid("admin", "user").required(),

});

const loginSchema = joi.object({
  email: joi.string().email().required(),

  password: joi.string().min(6).required(),
});

const otpSchema = joi.object({
  email: joi.string().email().required(),

  otp: joi.string().min(6).required(),
});

const resotp = joi.object({
  email:joi.string().email().required()
})

const resetPasswordSchema = joi.object({
  email: joi.string().email().required(),

  oldpassword: joi.string().min(6).required(),
  newpassword: joi.string().min(6).required()
});

const refreshtokens = joi.object({
  refreshtokens: joi.string().required()
})

module.exports = {
  signupSchema,
  loginSchema,
  otpSchema,
  resotp,
  resetPasswordSchema,
  refreshtokens
};
