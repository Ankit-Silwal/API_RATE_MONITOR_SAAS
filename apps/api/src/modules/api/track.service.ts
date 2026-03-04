import { pool } from "../../config/db";
import bcrypt from "bcrypt"

type TrackInput={
  apiKey:string,
  endpoint:string,
  status:number,
  responseTime:number
}

export async function trackApiUsage(data:TrackInput){
  const client=await pool.connect()

  try{
    const keys=await client.query(
      `
      select id,api_id,key_hash
      from api_keys
      `
    )




    //NOT SCALABLE NEED TO WORK AGAIN TO MAKE IT SCABLE WILL UISE CONCEPTS
    
    
    
    
    
    let apiId:string | null=null
    for(const key of keys.rows){
      const match =await bcrypt.compare(data.apiKey,key.key_hash);

      if(match){
        apiId:key.api_id
        break;
      }
    }
    if(!apiId){
      return null;
    }
    await client.query(
      `
      insert into api_usage_logs(
        api_id,
        endpoint,
        status_code,
        response_time
      )
        values ($1,$2,$3,$4)
      `,[
        apiId,
        data.endpoint,
        data.status,
        data.responseTime
      ]
    )
    return true
  }finally{
    client.release()
  }

}