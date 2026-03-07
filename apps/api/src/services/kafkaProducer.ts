import { producer } from "../config/kafka"

type UsageEvent = {
  apiId: string
  endpoint: string
  status: number
  responseTime: number
  timestamp: Date
}

export async function sendUsageEvent(event: UsageEvent)
{
  await producer.send({
    topic: "api-usage-events",
    messages: [
      {
        key: event.apiId,
        value: JSON.stringify(event)
      }
    ]
  })
}