import { pool } from "../../config/db";
import { generateApiKeys } from "../../utils/generateApiKeys";
import { hashApiKey } from "../../utils/hashApiKeys";

export async function createApiKey(apiId: string)
{
  const { fullKey, prefix, secret } = generateApiKeys()

  const keyHash = await hashApiKey(secret)

  const result = await pool.query(
    `
    INSERT INTO api_keys (api_id, key_prefix, key_hash)
    VALUES ($1,$2,$3)
    RETURNING id, created_at
    `,
    [apiId, prefix, keyHash]
  )

  return {
    key: fullKey,
    keyId: result.rows[0].id,
    createdAt: result.rows[0].created_at
  }
}


export async function getApiKey(apiId:string) {
 const result=await pool.query(`
  select id,key_prefix,created_at
  from api_keys
  where api_id=$1
  order by created_at desc 
  `,[apiId])

  return result.rows.map((row)=>({
    id:row.id,
    prefix:row.key_prefix,
    createdAt:row.created_at
  }))
}

export async function revokeApiKey(apiId: string, keyId: string)
{
  const result = await pool.query(
    `
    DELETE FROM api_keys
    WHERE id = $1
    AND api_id = $2
    RETURNING id
    `,
    [keyId, apiId]
  )

  return result.rows.length > 0
}