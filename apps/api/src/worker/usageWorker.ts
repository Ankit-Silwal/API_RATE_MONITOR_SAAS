import { Worker } from "bullmq";
import { queueConnection } from "../config/queue";
import { pool } from "../config/db";
import { getIo } from "../socket";

export const usageWorker=new Worker(
  "usage-events",
  async (job)=>{
    const event=job.data

    await pool.query(`
      insert into api_usage_logs
      (
      api_id,
      endpoint,
      status_code,
      response_time,
      recorded_at
      )
      values ($1,$2,$3,$4,$5)
      `,[
        event.apiId,
        event.endpoint,
        event.status,
        event.responseTime,
        event.timestamp
      ])

      const io=getIo()
      io.emit("api_usage",event)
  },{
    connection:queueConnection
  }
)