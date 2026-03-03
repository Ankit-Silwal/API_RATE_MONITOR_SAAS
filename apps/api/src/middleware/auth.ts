import { Request,Response,NextFunction } from "express"


import {verifyToken} from "@clerk/backend"
export async function requireAuth(req:Request,res:Response,next:NextFunction):Promise<void>{
  const authHeader=req.headers.authorization

  if(!authHeader){
    res.status(401).json({
      error:"Missing token sir"
    })
    return;
  }

  const token=authHeader.split(" ")[1]

  try{
    const payload=await verifyToken(token,{
      secretKey:process.env.CLERK_SECRET_KEY as string
    })
    req.userId=payload.sub;
    req.clerkPayLoad=payload;
    next()
  }catch{
    res.status(401).json({error:"Invalid token sir"})
  }

}



