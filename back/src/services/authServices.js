const UserModel = require('../models/user.model');
const { hashPassword, comparePassword } = require('../utils/password.util');
const { generateToken } = require('../utils/jwt.util');

const register = async (username, email, password) => {
  const hashedPassword = await hashPassword(password);
  const user = await UserModel.createUser(username, email, hashedPassword);
  return user;
};

const login = async (email, password) => {
  const user = await UserModel.findByEmail(email);
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const validPassword = await comparePassword(password, user.password);
  if (!validPassword) {
    throw new Error('Invalid credentials');
  }

  const token = generateToken({ id: user.id, username: user.username });
  return {
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email
    }
  };
};

module.exports = {
  register,
  login
};