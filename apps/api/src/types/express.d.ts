import {JwtPayload} from "@clerk/types"

declare global{ 
  namespace Express{
    interface Request{
      userId?:string,
      clerkPayLoad?:JwtPayload,
      api?:{
        id:string,
        name:string,
        base_url:string
      }
    }
  }
}

export {}