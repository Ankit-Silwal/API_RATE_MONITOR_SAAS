import { Request,Response,NextFunction } from "express";
import { pool } from "../config/db";

export async function verifyApiOwnership(
  req:Request,
  res:Response,
  next:NextFunction
){
  try{
    const apiId = req.params.apiId || req.params.id;
    const userId = req.userId;

    const result = await pool.query(
      `SELECT id, name, base_url FROM apis WHERE id = $1 AND user_id = $2`,
      [apiId, userId]
    );

    if(result.rows.length === 0){
      return res.status(403).json({
        message:"Access denied"
      });
    }

    req.api = result.rows[0];
    next();
  }catch(err){
    console.error(err);
    return res.status(500).json({
      message:"Authorization failed"
    });
  }
}
