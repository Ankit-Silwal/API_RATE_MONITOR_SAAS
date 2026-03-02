import {createServer} from "node:http"
import dotenv from "dotenv"
import {Server} from "socket.io"
import cookie from "cookie"
import app from "./app"


dotenv.config()
const PORT=process.env.PORT ||8000;
const httpServer=createServer(app);
export const io=new Server(httpServer,{
  cors:{
    origin:"http://localhost:3000",
    credentials:true
  }
})

httpServer.listen(PORT,()=>{
  console.log("The Server has started ")
})