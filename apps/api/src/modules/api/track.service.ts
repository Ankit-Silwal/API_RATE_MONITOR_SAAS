import { pool } from "../../config/db";
import bcrypt from "bcrypt"
import { getIo } from "../../socket";
import { checkRateLimit } from "../../utils/redisLimiter";
import { sendUsageEvent } from "../../services/kafkaProducer";

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
      select k.api_id,
      k.key_hash,
      a.rate_limit
      from api_keys k
      join apis a 
      on k.api_id=a.id
      where k.key_prefix=$1
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

    const allowed=await checkRateLimit(data.apiKey,key.rate_limit)
    if(!allowed){
      return "Rate_Limited"
    }

    await sendUsageEvent({
      apiId:key.api_id,
      endpoint:data.endpoint,
      status:data.status,
      responseTime:data.responseTime,
      timestamp:new Date()
    })

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