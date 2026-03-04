const jwt = require("jsonwebtoken");
const {
  accessToken,
  refreshToken,
  verifyToken,
} = require("../utils/tokengenerate");
const { hashpassword, comparepassword } = require("../utils/bcrypt");
const generateotp = require("../utils/otpgenerate");
const mailer = require("../utils/mailer");
const deletefile = require("../utils/fs");

const User = require("../models/usermodel");

const createuser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    let user = await User.findOne({ email });

    if (user) {
      deletefile(req.file?.path);
      return res.status(400).json({
        message: "user already exsits",
      });
    }
    const hashed = await hashpassword(password, 12);
    const otp = generateotp();
    user = await User.create({
      username,
      email,
      password: hashed,
      avatar: req.file? req.file.path : null,
      role,
      otp,
      isVerify: false,
      otpExpiry: Date.now() + 5 * 60 * 1000,
    });
    await mailer(email, otp);

    res.status(200).json({
      message: `otp is send to your email expire in 5 mint plz verify`,
      code: 200,
    });
  } catch (err) {
    deletefile(req.file?.path);
    res.status(500).json({
      message: "internal serverr error",
      code: 500,
      error: err.message,
    });
  }
};
const verifyotp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    let user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({
        message: "invalid email",
      });
    if (user.isVerify)
      return res.status(401).json({
        message: "user verified ",
      });
    if (otp != user.otp)
      return res.status(400).json({
        message: "invalid otp",
        code: 400,
      });

    // const dcode = await bcrypt.compare(otp.toString(), user.otp);

    if (!otp || user.otpExpiry < Date.now())
      return res.status(400).json({
        message: "invalid otp or expired otp",
        code: 400,
      });

    const payload = {
      id: user._id,
      email: user.email,
    };
    const tokenkey = process.env.SECRET_KEY;
    const refreshtoken = await jwt.sign(payload, tokenkey, { expiresIn: "1d" });

    user.refreshtoken = refreshtoken;
    user.otp = null;
    user.isVerify = true;
    user.otpExpiry = null;
    await user.save();

    res.status(201).json({
      message: "signup successfully",
      code: 201,
    });
  } catch (err) {
    res.status(500).json({
      message: "internal server error",
      code: 500,
      error: err.message,
    });
  }
};

const resendotp = async (req, res) => {
  try {
    const { email } = req.body;
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const otp = generateotp();

    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000;
    await user.save();
    await mailer(email, otp);
    res.status(200).json({
      message: `otp resend to your email plzz verify`,
    });
  } catch (error) {
    res.status(500).json({
      message: "internal server error",
      code: 500,
      error: error.message,
    });
  }
};

const changepassword = async (req, res) => {
  try {
    const { oldpassword, newpassword, email } = req.body;

    let user = await User.findOne({ email });

    if (!user)
      return res.status(401).json({
        message: "invalid user",
        code: "401",
      });
    const isMatch = await comparepassword(oldpassword, user.password);
    if (!isMatch)
      return res.status(401).json({
        message: "old password is wrong",
        code: 401,
      });

    const hash = await hashpassword(newpassword, 12);
    user.password = hash;
    await user.save();

    res.status(200).json({
      message: "password changed successfully",
      code: "200",
    });
  } catch (error) {
    res.status(500).json({
      message: "internal server error",
      code: 500,
      error: error.message,
    });
  }
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user)
      return res.status(401).json({
        message: "invalid email",
        code: 401,
      });
    const ismatch = await comparepassword(password, user.password);
    if (!ismatch)
      return res.status(401).json({
        message: "invalid password",
        code: 401,
      });

    if (!user.isVerify)
      return res.status(403).json({
        message: "plz verify your email first",
        code: 403,
      });

    const accesstoken = await accessToken(user);
    const [username, domain] = email.split("@");
    const firstPart = username.slice(0, 3); // first 3 letters
    const stars = "*".repeat(Math.max(username.length - 3, 0)); // rest as stars
    const maskedEmail = `${firstPart}${stars}@${domain}`;

    res.status(200).json({
      message: "login successfully",
      code: 200,
      user: maskedEmail,
      accesstoken,
    });
  } catch (error) {
    res.status(500).json({
      message: 500,
      error: error.message,
    });
  }
};

const refreshtoken = async (req, res) => {
  try {
    let { refreshtokens } = req.body;

    if (!refreshtokens)
      return res.status(401).json({
        message: "unauthorized",
        code: 401,
      });

    const decode = await verifyToken(refreshtokens);

    const newRefreshToken = await refreshToken({
      id: decode.id,
      email: decode.email,
    });
  

    res.status(200).json({
      message: "token refresh succesfully",
      code: 200,
      newRefreshToken,
    });
  } catch (error) {
    res.status(500).json({
      message: "internal server error",
      code: 500,
      error: error.message,
    });
  }
};

module.exports = {
  createuser,
  verifyotp,
  resendotp,
  changepassword,
  login,
  refreshtoken,
};
