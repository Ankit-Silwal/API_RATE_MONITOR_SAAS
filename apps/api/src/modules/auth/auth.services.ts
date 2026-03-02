import pool from "../../config/db";

export async function syncUser(clerkUserId:string,email:string):Promise<void>{
  const existing=await pool.query(
    `
    select id from users where clerk_user_id=$1)
    `,[clerkUserId]
  )
  if(existing.rows.length===0){
    await pool.query(`
      insert into users (clerk_user_id,email) 
      values ($1,$2)  
    `,[clerkUserId,email])
  }
}