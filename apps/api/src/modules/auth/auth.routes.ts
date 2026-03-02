import { Router } from "express"
import { requireAuth } from "../../middleware/auth"
import { syncUserController } from "./auth.controller"

const router = Router()

router.post("/sync", requireAuth, syncUserController)

export default router