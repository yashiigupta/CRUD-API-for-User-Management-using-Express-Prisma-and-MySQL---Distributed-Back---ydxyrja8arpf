const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const { prisma } = require('../db/config.js');

dotenv.config();

async function Login(req, res) {
  try {
    if(!req.body.email || !req.body.password) {
      return res.status(400).json({
        "error": "Email and password are required"
      })
    }
    const isThere = await prisma.user.findUnique({
      where: {
        email: req.body.email,
      }
    })
    if(!isThere) {
      return res.status(404).json({
        "error": "User not found"
      })
    }
    const unHashPass = await bcrypt.compare(req.body.password, isThere.password);
    if(!unHashPass) {
      return res.status(401).json({
        "error": "Invalid credentials"
      })
    }
    var token = jwt.sign({
      userId: isThere.id,
      name: isThere.name,
      email: isThere.email
    }, process.env.JWT_SECRET);
    return res.status(200).json({
      "userdata": {
        "id": isThere.id,
        "name": isThere.name,
        "email": isThere.email
      },
      "accesstoken": token
    })
  }
  catch(err) {
    console.log(err);
    return res.status(500).json({
      "error": "Internal server error"
    })
  }
}

module.exports = { Login };