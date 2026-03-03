import { createApi } from "./api.services";
import { createApiBody } from "./api.types";
import { Request,Response } from "express";
export const createApiController=async (req:Request<{},{},createApiBody>,res:Response)
:Promise<void>=>{
  try{
    const userId=req.userId;
    const {name,baseUrl,rateLimit}=req.body;
    if(!name || !baseUrl ||!rateLimit){
      res.status(400).json({
        message:"All fields are required (name,base_url and rate_limit"
      })
      return;
    }
    if(!userId){
      res.json({message:"User id is required"});
      return;
    }

    const api=await createApi(userId,name,baseUrl,rateLimit);

    res.status(200).json(api);
    return;
  }catch(error){
    console.error(error)
  }
}