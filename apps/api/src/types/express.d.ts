import {JwtPayload} from "@clerk/types"

declare global{ 
  namespace Express{
    interface Request{
      userId?:string,
      clerkPayLoad?:JwtPayload
    }
  }
}

export {}