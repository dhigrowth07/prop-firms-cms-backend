const bcrypt = require("bcrypt");

const SALT_ROUNDS = 12;

const hashPassword = async (password) => {
  if (!password) throw new Error("Password is required to hash");
  return await bcrypt.hash(password, SALT_ROUNDS);
};

const comparePasswords = async (plainPassword, hashedPassword) => {
  if (!plainPassword || !hashedPassword) return false;
  return await bcrypt.compare(plainPassword, hashedPassword);
};

module.exports = {
  hashPassword,
  comparePasswords,
};