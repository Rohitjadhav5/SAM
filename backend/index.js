const express = require("express");
const app = express();
const dotenv = require("dotenv");
const connectDB = require("./config/db")









dotenv.config({});
const PORT = process.env.PORT || 5000;
app.listen((PORT), ()=>{
    connectDB();
    console.log("Server is up")
})