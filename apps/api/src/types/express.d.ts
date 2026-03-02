import {JwtPayload} from "@clerk/types"

declare global{ 
  namespace Express{
    interface Request{
      userId?:string,
      clerkPayLoad?:JwtPayload & {
        email_addresses?:{
            email_address:string;
            id:string
        }[]
      }
    }
  }
}

export {}