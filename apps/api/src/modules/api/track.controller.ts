import { Request,Response } from "express";
import { trackApiUsage } from "./track.service";

export async function trackUsageController(
  req:Request,
  res:Response
){
  try{
    const apiKey=req.headers["x-api-key"] as string
    
    if(!apiKey){
      return res.status(400).json({
        message:"API key missing"
      })
    }
    const {endpoint,status,response_time}=req.body;

    const result=await trackApiUsage({
      apiKey,
      endpoint,
      status,
      responseTime:response_time
    })
    if(!result){
      return res.status(401).json({
        message:"Invalid API key"
      })
    }
    return res.status(200).json({
      message:"Usage logged"
    })
  }catch(err){
    console.error(err)
    return res.status(500).json({
      message:"Tracking failed"
    })
  }

}