const jwt = require("jsonwebtoken");

const accessToken = async (user) => {
  const payload = {
    id: user._id,
    email: user.email,
  };
  const tokenkey = process.env.SECRET_KEY;

  const token = await jwt.sign(payload, tokenkey, { expiresIn: "1d" });

  return token;
};

const refreshToken = async (user) => {
  const payload = {
    id: user._id,
    email: user.email,
  };
  const tokenkey = process.env.SECRET_KEY;

  const token = await jwt.sign(payload, tokenkey, { expiresIn: "7d" });

  return token;
};

const verifyToken = async (token) => {
  const decode = await jwt.verify(token, process.env.SECRET_KEY);

  return decode;
};

module.exports = {
  accessToken,
  refreshToken,
  verifyToken,
};
