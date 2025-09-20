// require('dotenv').config({path: './env'})
import dotenv from "dotenv"
import connectDB from "./db/index.js";
import {app} from './app.js'
// import express from "express";


dotenv.config({
    path: './env'
})

// const app = express();

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 2004, ()=>{
        console.log(`Server is running at port : ${process.env.PORT}`);
    })
})
.catch((err)=>{
    console.log("MONGODB connection failed !!!", 'error');
})