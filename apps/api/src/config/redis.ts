import {createClient} from "redis"
const REDIS_URL=process.env.REDIS_URL;
const REDIS_CLIENT=createClient({
  url:REDIS_URL
})

REDIS_CLIENT.on("error",()=>{
  console.log("Error on connecting with the redis please check it out")
})

REDIS_CLIENT.on("ready",()=>{
  console.log("The Redis server has started")
})

export async function initRedis():Promise<void> {
  if(!REDIS_CLIENT.isOpen){
    REDIS_CLIENT.connect();
  }
}

export default REDIS_CLIENT;