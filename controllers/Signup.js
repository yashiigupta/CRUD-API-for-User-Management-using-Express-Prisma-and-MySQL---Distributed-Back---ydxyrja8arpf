const { prisma } = require('../db/config.js');
const bcrypt = require('bcrypt');

async function Signup(req, res) {
  try {
    if(!req.body.name || !req.body.email || !req.body.password) {
      return res.status(400).json({
        "error": "Email is required"
      })
    }
    const isThere = await prisma.user.findUnique({
      where: {
        email: req.body.email
      }
    })
    if(isThere) {
      return res.status(400).json({
        "error": "Email already in use"
      })
    }
    const hashedPass = await bcrypt.hash(req.body.password, 10);
    const user = await prisma.user.create({
      data: {
        name: req.body.name,
        email: req.body.email,
        password: hashedPass,
      },
    })
    return res.status(201).json({
      "message": "User created successfully",
      "userId": user.id
    })
  }
  catch(err) {
    console.log(err);
    return res.status(500).json({
      "message": "Internal server error"
    })
  }
}

module.exports = { Signup };