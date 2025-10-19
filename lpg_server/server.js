import express from 'express';
import { app } from './app.js';
import { connectDB } from './config/db.js';
import dotenv from 'dotenv';

dotenv.config({
    path: "./.env"
});

connectDB()
.then(() => {
    app.on("error", (err) => {
        console.log("ERROR: ", err)
    })
    app.listen(process.env.PORT || 8000, () =>{
        console.log("app listening on port: ", process.env.PORT)
    })
})
.catch((err) => {
    console.log()
})