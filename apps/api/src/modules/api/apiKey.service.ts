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