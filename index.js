const express = require('express');
const dotenv = require('dotenv'); 
const bcrypt = require('bcrypt');
const { prisma } = require("./db/config.js");
const jwt = require('jsonwebtoken');
dotenv.config(); 

const app = express();
app.use(express.json()); 

const PORT = process.env.PORT || 3000;  

app.post("/api/auth/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if(!email || !password) {
      return res.status(400).json({ "error": "Email is required" });
    }
    const isThere = await prisma.user.findUnique({
      where: {
        email: email
      }
    });
    if(isThere) {
      return res.status(400).json({ "error": "Email already in use" });
    }
    const hashedPass = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hashedPass
      }
    })
    return res.status(201).json({ "message": "User created successfully", "userId": user.id });
  }
  catch(err) {
    console.log(err);
    return res.status(500).json({ "Error": "Internal server error" })
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if(!email || !password) {
      return res.status(400).json({ "error": "Email and password are required" });
    }
    const isThere = await prisma.user.findUnique({
      where: {
        email: email
      }
    });
    if(!isThere) {
      return res.status(404).json({ "error": "User not found" });
    }
    const isPassword = await bcrypt.compare(password, isThere.password);
    if(!isPassword) {
      return res.status(401).json({ "error": "Invalid credentials" });
    }

    const accesstoken = jwt.sign({ id: isThere.id, name: isThere.name, email }, "68d97a7b7965450091cd86a139a66caaca857c05511860b11b0064e388ba105328de791c8336dd7561f52ea7f2fa64f2d09810cfea12978b571cdceab05270b");
    return res.status(200).json({ "userdata": { "userId": isThere.id, "name": isThere.name, email, password} , accesstoken });
  }
  catch(err) {
    console.log(err);
    return res.status(500).json({ "Error": "Internal server error" })
  }
});

app.listen(PORT, () => {
  console.log(`Backend server is running at http://localhost:${PORT}`);
});

module.exports=  app;