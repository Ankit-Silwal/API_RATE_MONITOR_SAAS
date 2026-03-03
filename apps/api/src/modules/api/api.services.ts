import { pool } from "../../config/db";

export async function createApi(userId:string,name:string,baseUrl:string,rateLimit:Number) {
  if(!userId){
    return new Error("Pass the userId please")
  }
  const result=await pool.query(
    `
      insert into api (user_id,name,base_url,rate_limit)
      values ($1,$2,$3,$4)
      returning *
    `,[userId,name,baseUrl,rateLimit]
  )
  return result.rows[0];
}