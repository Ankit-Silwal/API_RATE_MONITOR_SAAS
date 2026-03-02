import { Request,Response } from "express";
import { syncUser } from "./auth.services";

export async function syncUserController(req:Request,res:Response):Promise<void>{
  if(!req.userId){
    res.status(401).json({
      error:"Unauthorized"
    })
    return;
  }
  const email=req.clerkPayLoad?.email_addresses?.[0]?.email_address ?? "unknown"
  await syncUser(req.userId,email)
  res.json({success:true});
}