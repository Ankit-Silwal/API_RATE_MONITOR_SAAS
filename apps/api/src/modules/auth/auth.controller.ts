import { Request,Response } from "express";
import { syncUser } from "./auth.services";
import { createClerkClient } from "@clerk/backend";

export async function syncUserController(req:Request,res:Response):Promise<void>{
  if(!req.userId){
    res.status(401).json({
      error:"Unauthorized"
    })
    return;
  }
  
  const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });
  const user = await clerkClient.users.getUser(req.userId);
  const email = user.emailAddresses[0]?.emailAddress ?? "unknown";
  
  console.log("sync hit",req.userId, "email:", email);
  await syncUser(req.userId,email)
  res.json({success:true});
}