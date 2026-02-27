const express = require("express");
const routes = express.Router();
const validate = require("../middelwares/validate")
const {signupSchema, loginSchema, otpSchema, resetPasswordSchema, } = require("../validators/userValidator")

const upload = require("../middelwares/multer");
const {
  createuser,
  verifyotp,
  resendotp,
  login,
  changepassword,
  refreshtoken,
} = require("../controllers/userControllers");



routes.post("/signup", upload.single("image"),validate(signupSchema), createuser);
routes.post("/login",validate(loginSchema), login);

routes.post("/otp",validate(otpSchema), verifyotp);
routes.post("/resendotp",validate(otpSchema), resendotp);

routes.post("/resetpassword",validate(resetPasswordSchema), changepassword);
routes.post("/retoken", refreshtoken);


module.exports = routes;
