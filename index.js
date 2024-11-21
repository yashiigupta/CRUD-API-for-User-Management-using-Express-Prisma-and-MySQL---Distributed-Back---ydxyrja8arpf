const express = require('express');
const dotenv = require('dotenv'); 
const { Signup } = require('./controllers/Signup.js');
const { Login } = require('./controllers/Login.js');
dotenv.config();

const app = express();

app.use(express.json()); 

const PORT = process.env.PORT || 3000; 

app.post("/api/auth/signup", Signup);
app.post("/api/auth/login", Login);


app.listen(PORT, () => {
  console.log(`Backend server is running at http://localhost:${PORT}`);
});

module.exports = app;