import {consumer} from "../config/kafka"
import { pool } from "../config/db"

export async function startUsingConsumer(){
  await consumer.connect()

  await consumer.subscribe({
    topic:"api-usage-events",
    fromBeginning:false
  })

  await consumer.run({
    eachMessage:async ({message})=>{
      const event=JSON.parse(
        message.value!.toString()
      )
      await pool.query(
        `Insert into api_usage_logs
        (
        api_id
        endpoint,
        status_code,
        response_time,
        recorded_at
        )
        values ($1,$2,$3,$4,$5)`,[
          event.apiId,
          event.endpoint,
          event.status,
          event.responseTime,
          event.timestamp
        ]
      )
    }
  })
}