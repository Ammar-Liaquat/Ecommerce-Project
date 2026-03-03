const bcrypt = require("bcrypt");
const hashpassword = async (password) => {
  const salt = await bcrypt.genSalt(12);
  return await bcrypt.hash(password, salt);
};
const comparepassword = async (password, hashpassword) => {
  return await bcrypt.compare(password, hashpassword);
};

module.exports = { hashpassword, comparepassword };
