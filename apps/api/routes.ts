import { Application } from "express"
import authRoutes from "./src/modules/auth/auth.routes"
import organizationRoutes from "./src/modules/organization/organization.routes";
import apiRoutes from "./src/modules/api/api.routes"
export function setUPRoutes(app:Application){
  app.use("/auth",authRoutes)
  app.use("/organizations",organizationRoutes);
  app.use("/api",apiRoutes);
}