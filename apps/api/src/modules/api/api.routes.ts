import { createApiController } from "./api.controller"; 
import { Router } from "express";
import { requireAuth } from "../../middleware/auth";
const router=Router();

router.post('/',requireAuth,createApiController);

export default router;