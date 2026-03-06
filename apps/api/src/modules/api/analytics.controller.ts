import { Request, Response } from "express";
import { getApiStats, getEndPointUsage, getRequestsPerMinute } from "./analytics.service";

export async function getApiStatsController(
  req:Request<{apiId:string},{},{},{range?:string}>
  ,res:Response){
  try{
    const apiId = req.api!.id;
    const {range}=req.query
    const stats = await getApiStats(apiId,range);

    return res.status(200).json(stats);
  } catch(error){
    console.log(error);
    return res.status(500).json({
      message:"Failed to fetch stats"
    });
  }
}


export async function getEndPointUsageController(
  req:Request,
  res:Response
){
  const apiId = req.api!.id;

  const data = await getEndPointUsage(apiId);
  return res.status(200).json(data);
}

export async function getRequestPerMinuteController(
  req:Request,
  res:Response
):Promise<Response>{
  try{
    const apiId = req.api!.id;

    const data = await getRequestsPerMinute(apiId);

    return res.status(200).json(data);
  }catch(err){
    console.log(err);
    return res.status(500).json({
      message:"Failed to fetch request metrics"
    });
  }
}