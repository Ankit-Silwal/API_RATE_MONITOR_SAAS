import { pool } from "../../config/db";
import bcrypt from "bcrypt"
import { getIo } from "../../socket";
import { checkRateLimit } from "../../utils/redisLimiter";

type TrackInput={
  apiKey:string,
  endpoint:string,
  status:number,
  responseTime:number
}

export async function trackApiUsage(data: TrackInput)
{
  const client = await pool.connect()

  try
  {
    
    const parts = data.apiKey.split(".")
    if (parts.length !== 2)
    {
      return null
    }

    const [prefix, secret] = parts

    const result = await client.query(
      `
      SELECT api_id, key_hash
      FROM api_keys
      WHERE key_prefix = $1
      `,
      [prefix]
    )

    if (result.rows.length === 0)
    {
      return null
    }

    const key = result.rows[0]

    const match = await bcrypt.compare(secret, key.key_hash)

    if (!match)
    {
      return null
    }

    const allowed=await checkRateLimit(data.apiKey,100)
    if(!allowed){
      return "Rate_Limited"
    }

    await client.query(
      `
      INSERT INTO api_usage_logs
      (
        api_id,
        endpoint,
        status_code,
        response_time
      )
      VALUES ($1,$2,$3,$4)
      `,
      [
        key.api_id,
        data.endpoint,
        data.status,
        data.responseTime
      ]
    )

    const io=getIo();

    io.emit("api_usage",{
      apiId:key.api_id,
      endpoint:data.endpoint,
      status:data.status,
      responseTime:data.responseTime,
      timestamp:new Date()
    })

    return true
  }
  finally
  {
    client.release()
  }
}