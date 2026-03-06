import { Request,Response,NextFunction } from "express";
import { pool } from "../config/db";

export async function verifyApiOwnership(
  req:Request,
  res:Response,
  next:NextFunction
){
  try{
    const {apiId}=req.params

    const userId=req.userId

    const result=await pool.query(`
      select id from apis
      where id=$1
      and user_id=$2
      `,[apiId,userId]
    )
    if(result.rows.length===0){
      return res.status(403).json({
        message:"Access denied"
      })
    }
    next()
  }catch(err){
    console.error(err)
    return res.status(500).json({
      message:"Authorization failed nigga"
    })
  }
}
