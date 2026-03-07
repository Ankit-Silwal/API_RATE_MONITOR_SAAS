import {Queue} from "bullmq"

const redisUrl=process.env.REDIS_URL;

if(!redisUrl){
  throw new Error("REDIS_URL is required to initialize BullMQ queue")
}

const parsedRedisUrl=new URL(redisUrl)

export const queueConnection={
  host:parsedRedisUrl.hostname,
  port:Number(parsedRedisUrl.port||6379),
  username:parsedRedisUrl.username||undefined,
  password:parsedRedisUrl.password||undefined
}

export const usageQueue=new Queue(
  "usage-events",{
    connection:queueConnection
  }
)