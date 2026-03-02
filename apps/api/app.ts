import express from "express"
import { Request,Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser"
import { setUPRoutes } from "./routes";
import { initReids } from "./src/config/redis";
import { connectDB } from "./src/config/db";
const app=express()
app.use(express.json())
app.use(cors({
  credentials:true,
  origin:"http://localhost:3000"
}))
// initReids();
// connectDB();
app.use(cookieParser())
app.get('/health',(req:Request,res:Response)=>{
  res.json({
    succes:true,
    health:'fit as fuck sir'
  })
})
setUPRoutes(app);

export default app;