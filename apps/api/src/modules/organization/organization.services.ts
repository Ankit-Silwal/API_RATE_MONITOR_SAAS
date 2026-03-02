import { pool } from "../../config/db";

export async function createOrganization(name:string,clerkUserId:string):Promise<string>{
  const userResult=await pool.query(`select id from users where clerk_user_id=$1`,
    [clerkUserId]
  )
  const user=userResult.rows[0];
  if(!user){
    throw new Error("User wasnt found");
  }
  const orgResult=await pool.query(
    `Insert into organizations (name ) values ($1) returning id`,[name]
  )

  const orgId=orgResult.rows[0].id
  await pool.query(`
    Insert into organization_members (user_id,organization_id,role)
    values ($1,$2,'admin')
    `,[user.id,orgId])
  return orgId
}
