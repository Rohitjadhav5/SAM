const express = require("express")
const {register, login,logout} = require("../controllers/users.controller")
const route = express.Router();

route.post('/register',register);
route.post('/login',login);
route.get('/logout',logout);

module.exports = route;