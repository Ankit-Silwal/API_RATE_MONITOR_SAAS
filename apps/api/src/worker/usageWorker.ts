import { Worker, Job } from "bullmq"
import { queueConnection } from "../config/queue"
import { pool } from "../config/db"
import { getIo } from "../socket"
import { deadLetterQueue } from "../config/deadLetterQueue"

type UsageEvent =
{
  apiId: string
  endpoint: string
  status: number
  responseTime: number
  timestamp: Date
}

export const usageWorker = new Worker<UsageEvent>(
  "usage-events",

  async (job: Job<UsageEvent>) =>
  {
    const event = job.data

    await pool.query(
      `
      INSERT INTO api_usage_logs
      (
        api_id,
        endpoint,
        status_code,
        response_time,
        recorded_at
      )
      VALUES ($1,$2,$3,$4,$5)
      `,
      [
        event.apiId,
        event.endpoint,
        event.status,
        event.responseTime,
        event.timestamp
      ]
    )

    const io = getIo()

    io.emit("api_usage", event)
  },

  {
    connection: queueConnection,
    concurrency: 10
  }
)


usageWorker.on("completed", (job) =>
{
  console.log(`Job ${job.id} completed`)
})




usageWorker.on("failed", async (job, err) =>
{
  if (!job) return

  console.error(`Job ${job.id} failed`, err)



  if (job.attemptsMade >= (job.opts.attempts ?? 0))
  {
    await deadLetterQueue.add(
      "failed-usage-event",
      {
        originalJob: job.data,
        error: err?.message,
        failedAt: new Date()
      }
    )

    console.error(`Job ${job.id} moved to DLQ`)
  }
})