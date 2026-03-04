import { Request,Response } from "express";
import { trackApiUsage } from "./track.service";

export async function trackUsageController(
  req: Request,
  res: Response
)
{
  try
  {
    const apiKeyHeader = req.headers["x-api-key"]

    if (!apiKeyHeader || typeof apiKeyHeader !== "string")
    {
      return res.status(401).json({
        message: "API key missing"
      })
    }
    const apiKey = apiKeyHeader
    const { endpoint, status, response_time } = req.body

    if (!endpoint || typeof status !== "number" || typeof response_time !== "number")
    {
      return res.status(400).json({
        message: "Invalid request payload"
      })
    }

    const result = await trackApiUsage({
      apiKey,
      endpoint,
      status,
      responseTime: response_time
    })

    if (!result)
    {
      return res.status(401).json({
        message: "Invalid API key"
      })
    }

    return res.status(200).json({
      message: "Usage logged"
    })
  }
  catch (err)
  {
    console.error(err)

    return res.status(500).json({
      message: "Tracking failed"
    })
  }
}