//The controller files are where we actually define the endpoints

//const User = require('../models/user');
//need to implement this model ^
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const sequelize = require('../config/database');
const dotenv = require('dotenv');

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
const salt = bcrypt.genSaltSync(10);

exports.registerUser = async (req, res) => {
  const { username, password } = req.body; //get username and pwd form request body
  
  //if username or password not in req body then return error
  if (!username || !password){
    return res.status(400).json({ error: 'Username and password required' });
    }

  try{
    //sql query returns first existing user that has the same username
    //if no user with same username then it returns null
    const [existingUser] = await sequelize.query(
      'SELECT * FROM Users WHERE username = :username LIMIT 1',
      {
        replacements: {username},
        type: sequelize.QueryTypes.SELECT,
      });
      //if there is a user with same username return error otherwise register user
      if (existingUser){
        return res.status(409).json({error: 'Username already exists'})
      }

      //hash the password
      const hashedPassword = await bcrypt.hash(password, salt);
      //insert the username and password into the DB
      const now = new Date().toISOString();

      await sequelize.query(
        'INSERT INTO Users (username, password, createdAt, updatedAt) VALUES (:username, :hashedPassword, :createdAt, :updatedAt)',
        {
          replacements: {username, hashedPassword, createdAt: now, updatedAt: now},
          type: sequelize.QueryTypes.INSERT,
        }
      );
      
      return res.status(201).json({ message: 'User successfully registered'});
  }
  //catch errors
  catch(err){
    console.error('Register error: ', err);
    return res.status(500).json({ error: 'Failed to register user' });
  }
};

exports.loginUser = async (req, res) => {
  //get username and password from request body
  const {username, password} = req.body;
  //if username or password not in req body then return error
  if (!username || !password){
    return res.status(400).json({ error: 'Username and password required' });
    }
  
  try{
    //search DB for user with the same username
    const [user] = await sequelize.query(
      'SELECT * FROM Users WHERE username = :username LIMIT 1',
      {
        replacements: {username},
        type: sequelize.QueryTypes.SELECT,
      }
    );
    //return error if user DNE
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    //check if password is correct
    const validUser = await bcrypt.compare(password, user.password);
    //if incorrect return error
    if(!validUser){
      return res.status(401).json({ error: 'Invalid username or password'});
    }

    //if correct generate jwt
    const token = jwt.sign(
      {id: user.id, username: user.username}, //payload
      JWT_SECRET, //secret
      {expiresIn: '1D'} //options (set expiration of jwt to 1 day)
    );

    //store the jwt in cookies
    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 24*60*60*1000, //equivalent to 1D in ms
    });

    return res.status(200).json({ message: 'Log in successful', username: user.username, token});
    }
  catch(err){
      console.error('Login Error: ', err);
      return res.status(500).json({ error: 'Login failed' })
  }
};

exports.logoutUser = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
  });
  return res.status(200).json({ message: 'Logged out successfully' });
};