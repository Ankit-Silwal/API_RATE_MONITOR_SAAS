import REDIS_CLIENT from "../config/redis";

export async function checkRateLimit(apiKey:string,limit:number){
  const key=`rate:${apiKey}`
  const count=await REDIS_CLIENT.incr(key)

  if(count===1){
    await REDIS_CLIENT.expire(key,1);
  }

  if(count>limit){
    return false;
  }

  return true;

}