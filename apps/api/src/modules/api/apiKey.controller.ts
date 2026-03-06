import { Request,Response } from "express";
import { createApiKey, getApiKey, revokeApiKey } from "./apiKey.service";

export async function generateApiKeyController(
  req:Request,
  res:Response
){
  try{
    const apiId = req.api!.id;
    const result = await createApiKey(apiId);

    return res.status(200).json({
      message:"APi key generated",
      apiKey:result.key,
      keyId:result.keyId, 
      createdAt:result.createdAt
    });
  }catch(err){
    console.error(err);

    return res.status(500).json({
      message:"Failed to generate API keys"
    });
  }
}

export async function getApiKeysController(
  req:Request,
  res:Response
){
  try{
    const apiId = req.api!.id;

    const keys = await getApiKey(apiId);

    return res.status(200).json(keys);
  }catch(err){
    console.error(err);
    return res.status(500).json({
      message:"Failed to fetch API keys"
    });
  }
}

export async function revokeApiKeyController(
  req: Request<{keyId:string}>,
  res: Response
)
{
  try
  {
    const apiId = req.api!.id;
    const { keyId } = req.params;

    const revoked = await revokeApiKey(apiId, keyId);

    if (!revoked)
    {
      return res.status(404).json({
        message: "API key not found"
      });
    }

    return res.status(200).json({
      message: "API key revoked"
    });
  }
  catch (error)
  {
    console.error(error);

    return res.status(500).json({
      message: "Failed to revoke API key"
    });
  }
}