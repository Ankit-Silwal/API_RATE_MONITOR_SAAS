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
    "log-usage",
    event,
    {
      attempts:5, //retry up to5 times
      backoff:{
        type:"exponential", //1 2 4 8 shit
        delay:1000 //1 sec
      },
      removeOnComplete:true, //keep queue clean
      removeOnFail:false    //failed jobs stays
    }
  )
}