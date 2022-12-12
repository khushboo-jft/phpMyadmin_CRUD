
const jwt = require('jsonwebtoken');
const express=require("express");
const cookieParser = require('cookie-parser');
const app=express()
app.use(express.json())
app.use(cookieParser());
require('dotenv').config();

const verifyJWT = (req, res, next) => {
    const authHeader=req.headers['authorization'];
    if (!authHeader) return res.sendStatus(401);
    const token=authHeader;
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) return res.sendStatus(403); //invalid token
            next();
        }
    );
}

module.exports = verifyJWT