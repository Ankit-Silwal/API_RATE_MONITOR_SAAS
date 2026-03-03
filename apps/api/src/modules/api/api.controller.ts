import { createApi } from "./api.services";
import { createApiBody } from "./api.types";
import { Request,Response } from "express";
import { pool } from "../../config/db";
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

export const getApiController=async (req:Request,res:Response)=>{
  if(!req.userId){
    res.status(401).json({
      message:"Unauthorized"
    })
  }
  const result=await pool.query(
    `select id,name,base_url,rate_limit,created_at
    from apis
    where user_id=$1
    order by created_at desc`,[req.userId]
  );
  res.status(200).json(result.rows)
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
  const {id}=req.params;

  const result=await pool.query(
    `
      delete from apis
      where id=$1 and user_id=$2 
      returning id   
    `,[id,req.userId]
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