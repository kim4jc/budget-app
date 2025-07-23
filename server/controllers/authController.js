//The controller files are where we actually define the endpoints

//const User = require('../models/user');
//need to implement this model ^
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const salt = bcrypt.genSaltSync(10);
const JWT_SECRET = process.env.JWT_SECRET;

exports.registerUser = async (req, res) => {
  // logic here
};

exports.loginUser = async (req, res) => {
  // logic here
};

exports.logoutUser = (req, res) => {
  // logic here
};