import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { dbconnection } from './db.js';
import { userRouter } from './Routes/user.js';
import { recipeRouter } from './Routes/recipe.js';

//Configure env
dotenv.config();

let app=express();
let PORT=process.env.PORT;

//middlewares
app.use(express.json());
app.use(cors());

//db connection
dbconnection();

//routes
app.use("/api/user",userRouter);
app.use("/api/recipe",recipeRouter);

//server connection
app.listen(PORT,()=>console.log(`Server running in localhost:${PORT}`));