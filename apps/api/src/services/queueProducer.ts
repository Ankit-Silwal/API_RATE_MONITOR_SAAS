import { usageQueue } from "../config/queue";

type UsageEvent={
  apiId:string,
  endpoint:string,
  status:Number,
  responseTime:Number,
  timestamp:Date
}

export async function enqueueUsageEvent(event:UsageEvent){
  await usageQueue.add(
    "log-usage",event
  )
}