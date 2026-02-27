const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/usermodel");
const fs = require("fs");

const createuser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    let user = await User.findOne({ email });

    if (user) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({
        message: "user already exsits",
      });
    }
    if (!username) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(407).json({
        message: "username required",
      });
    }
    if (!email) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(407).json({
        message: "email required",
      });
    }
    if (!password) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(407).json({
        message: "password required",
      });
    }
    if (!role) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(407).json({
        message: "role required",
      });
    }
    if (!req.file)
      return res.status(407).json({
        message: "avatar required",
      });

    const salt = await bcrypt.genSalt(12);
    const hashpassword = await bcrypt.hash(password, salt);

    const generateotp = Math.floor(100000 + Math.random() * 900000);

    // const hashotp = await bcrypt.hash(generateotp.toString(), salt);

    user = await User.create({
      username,
      email,
      password: hashpassword,
      avatar: req.file.path,
      role,
      otp: generateotp,
      isVerify: false,
      otpExpiry: Date.now() + 5 * 60 * 1000,
    });

    const transport = await nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.NodeMail_ID,
        pass: process.env.NodeMailPassword,
      },
    });
    await transport.sendMail({
      from: process.env.NodeMail_ID,
      to: email,
      subject: "Welcome to ammar commpany",
      text: `your otp code is ${generateotp} otp expire in 5 mint plz verify`,
    });

    res.status(200).json({
      message: `otp is send to your email plzz verify`,
    });
  } catch (err) {
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
        messge: "invalid otp or expird otp",
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
    const generateotp = Math.floor(100000 + Math.random() * 900000);

    const transport = await nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.NodeMail_ID,
        pass: process.env.NodeMailPassword,
      },
    });
    await transport.sendMail({
      from: process.env.NodeMail_ID,
      to: user.email,
      subject: "Welcome to ammar commpany",
      text: `your otp code is ${generateotp} otp expire in 5 mint plz verify`,
    });

    user.otp = generateotp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000;
    await user.save();
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

    const comparepassword = await bcrypt.compare(oldpassword, user.password);
    if (!comparepassword)
      return res.status(401).json({
        message: "old password is wrong",
        code: 401,
      });

    const gensalt = await bcrypt.genSalt(12);
    const hashpassword = await bcrypt.hash(newpassword, gensalt);
    user.password = hashpassword;
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
    const comparepassword = await bcrypt.compare(password, user.password);
    if (!comparepassword)
      return res.status(401).json({
        message: "invalid password",
        code: 401,
      });

    if (!user.isVerify)
      return res.status(403).json({
        message: "plz verify your email first",
        code: 403,
      });
    const tokenkey = process.env.SECRET_KEY;
    const payload = {
      id: user._id,
      email: user.email,
    };
    const accesstoken = await jwt.sign(payload, tokenkey, { expiresIn: "1d" });

    const [username, domain] = email.split("@");
    const firstPart = username.slice(0, 3); // first 3 letters
    const stars = "*".repeat(Math.max(username.length - 3, 0)); // rest as stars
    const maskedEmail = `${firstPart}${stars}@${domain}`;

    res.status(200).json({
      message: "login successfully",
      code: 200,
      user: maskedEmail,
      accesstoken: accesstoken,
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
    const { refreshtoken } = req.body;

    if (!refreshtoken)
      return res.status(401).json({
        message: "unauthorized",
        code: 401,
      });
    const verifytoken = await jwt.verify(refreshtoken, process.env.SECRET_KEY);

    const payload = {
      id: verifytoken.id,
      email: verifytoken.email,
    };
    const newtoken = await jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: "7d",
    });

    res.status(200).json({
      message: "token refresh succesfully",
      code: 200,
      data: newtoken,
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
