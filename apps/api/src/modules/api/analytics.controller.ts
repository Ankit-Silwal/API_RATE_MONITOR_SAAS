import { Request, Response } from "express";
import { getApiStats, getEndPointUsage, getRequestsPerMinute } from "./analytics.service";

export async function getApiStatsController(req:Request<{apiId:string}>,res:Response){
  try{
    const {apiId}=req.params;
    const stats=await getApiStats(apiId)

    return res.status(200).json(stats);
  } catch(error){
    console.log(error);
    return res.status(500).json({
      message:"Failed to fetch stats"
    })
  }
}


export async function getEndPointUsageController(
  req:Request<{apiId:string}>,
  res:Response
){
  const {apiId}=req.params;

  const data=await getEndPointUsage(apiId)
  return res.status(200).json(data)
}

export async function getRequestPerMinuteController(
  req:Request<{apiId:string}>,
  res:Response
):Promise<Response>{
  try{
    const {apiId}=req.params;

    const data=await getRequestsPerMinute(apiId)

    return res.status(200).json(data);
  }catch(err){
    console.log(err);
    return res.status(500).json({
      message:"Failed to fetch request metrics"
    })
  }
}