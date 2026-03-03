import { createApiController, deleteApiController } from "./api.controller";
import { getApiController } from "./api.controller";
import { Router } from "express";
import { requireAuth } from "../../middleware/auth";
const router=Router();

router.post('/',requireAuth,createApiController);
router.get('/',requireAuth,getApiController);
router.delete('/:id',deleteApiController);

export default router;