import { Request,Response } from "express";
import { createApiKey } from "./apiKey.service";

export async function generateApiKeyController(
  req:Request<{apiId:string}>,
  res:Response
){
  try{
    const {apiId}=req.params
    const result=await createApiKey(apiId)

    return res.status(200).json({
      message:"APi key generated",
      apiKey:result.key,
      keyId:result.keyId,
      createdAt:result.createdAt
    })
  }catch(err){
    console.error(err)

    return res.status(500).json({
      message:"Failed to generate API keys"
    })
  }
}