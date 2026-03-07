import {createServer} from "node:http"
import dotenv from "dotenv"
import {initSocket} from "./src/socket"
import app from "./app"
import "./src/worker/usageWorker"

dotenv.config()
const PORT=process.env.PORT ||8000;
const httpServer=createServer(app);

initSocket(httpServer)

httpServer.listen(PORT,()=>{
  console.log("The Server has started ")
})