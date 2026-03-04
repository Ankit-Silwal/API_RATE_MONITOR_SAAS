import { Request,Response,NextFunction } from "express"


import {verifyToken} from "@clerk/backend"
export async function requireAuth(req:Request,res:Response,next:NextFunction):Promise<void>{
  // const authHeader=req.headers.authorization

  // if(!authHeader){
  //   res.status(401).json({
  //     error:"Missing token sir"
  //   })
  //   return;
  // }

  // const token=authHeader.split(" ")[1]

  // try{
  //   const payload=await verifyToken(token,{
  //     secretKey:process.env.CLERK_SECRET_KEY as string,
  //     audience:"http://localhost:3000"
  //   })
  //   req.userId=payload.sub;
  //   req.clerkPayLoad=payload;
  //   next()
  // }catch(error){
  //   console.error(error);
  //   res.status(401).json({error:"Verification Error"})
  // }
  req.userId="3f6c2f8a-7a9e-4d1b-9e3b-2c4d6e8f1a90"
  next()
}



