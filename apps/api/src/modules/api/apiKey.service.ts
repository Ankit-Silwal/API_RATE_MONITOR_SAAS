import { pool } from "../../config/db";
import { generateApiKeys } from "../../utils/generateApiKeys";
import { hashApiKey } from "../../utils/hashApiKeys";

export async function createApiKey(apiId:string){
  const rawKey=generateApiKeys()

  const keyHash=hashApiKey(rawKey);

  const result=await pool.query(
    `
      insert into api_keys (api_id,key_hash)
      values ($1,$2)
      returning id, created_at
    `,[apiId,keyHash]
  )

  return{
    key:rawKey,
    keyId:result.rows[0].id,
    createdAt:result.rows[0].created_at
  }
}