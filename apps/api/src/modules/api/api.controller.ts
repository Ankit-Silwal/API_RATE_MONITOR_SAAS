import { createApi } from "./api.services";
import { CreateApiBody } from "./api.types";
import { Request,Response } from "express";
import { pool } from "../../config/db";

// Helper function to get internal user UUID from Clerk ID
async function getUserIdFromClerkId(clerkUserId: string): Promise<string | null> {
  const result = await pool.query(
    `SELECT id FROM users WHERE clerk_user_id = $1`,
    [clerkUserId]
  );
  return result.rows.length > 0 ? result.rows[0].id : null;
}

export const createApiController=async (
  req:Request<{},{},CreateApiBody>,
  res:Response
)=>{
  if(!req.userId){
    return res.status(401).json({
      message:"Unauthorized"
    })
  }
  
  // Get internal user UUID from Clerk ID
  const internalUserId = await getUserIdFromClerkId(req.userId);
  if(!internalUserId){
    return res.status(404).json({
      message:"User not found"
    })
  }
  
  const {name,baseUrl,rateLimit}=req.body;
  
  try{
    const result=await createApi(internalUserId,name,baseUrl,rateLimit);
    return res.status(201).json(result);
  }catch(error){
    return res.status(500).json({
      message:"Failed to create API",
      error:error instanceof Error?error.message:"Unknown error"
    })
  }
}

export const getApiController=async (req:Request,res:Response)=>{
  if(!req.userId){
    return res.status(401).json({
      message:"Unauthorized"
    })
  }
  
  // Get internal user UUID from Clerk ID
  const internalUserId = await getUserIdFromClerkId(req.userId);
  if(!internalUserId){
    return res.status(404).json({
      message:"User not found"
    })
  }
  
  const result=await pool.query(
    `select id,name,base_url,rate_limit,created_at
    from apis
    where user_id=$1
    order by created_at desc`,[internalUserId]
  );
  return res.status(200).json(result.rows)
}

export const deleteApiController=async (
  req:Request<{id:string}>,
  res:Response
)=>{
  if(!req.userId){
    res.status(401).json({
      message:"Unauthorized"
    })
    return;
  }
  
  // Get internal user UUID from Clerk ID
  const internalUserId = await getUserIdFromClerkId(req.userId);
  if(!internalUserId){
    res.status(404).json({
      message:"User not found"
    })
    return;
  }
  
  const {id}=req.params;

  const result=await pool.query(
    `
      delete from apis
      where id=$1 and user_id=$2 
      returning id   
    `,[id,internalUserId]
  )
  if(!result.rows.length){
    res.status(404).json({
      message:"API not found"
    })
    return
  }
  res.status(200).json({
    message:"API deleted"
  })
}