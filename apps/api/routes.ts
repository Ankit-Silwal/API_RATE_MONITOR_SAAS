import { Application } from "express"
import authRoutes from "./src/modules/auth/auth.routes"
export function setUPRoutes(app:Application){
  app.use("/auth",authRoutes)
}