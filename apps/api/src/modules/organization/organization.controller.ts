import {Request,Response} from "express"
import { createOrganization, getUserOrganizations } from "./organization.services"
type organizationtype={
  error?:string
  organizationId?:string
}
export async function createOrganizationController(
  req:Request,
  res:Response<organizationtype>
):Promise<Response<organizationtype>>{
  if(!req.userId){
    return res.status(401).json({
      error:"Unauthorized"
    })
  }
  const {name}=req.body;
  if(!name){
    return res.status(400).json({
      error:"Organization name is required sir"
    })
  }
  try{
    const orgId=await createOrganization(name,req.userId)

    return res.json({
      organizationId:orgId
    })
  }catch(error){
    console.error(error);
    return res.status(400).json({
      error:"Failed to create organization"
    })
  }
}

export async function getOrganizationsController(
  req:Request,
  res:Response):Promise<Response<organizationtype>> {
  if(!req.userId){
    return res.status(401).json({
      error:"Unauthorized"
    })
  }
  const organizations=await getUserOrganizations(req.userId)
  return res.json({
    organizations
  })
}