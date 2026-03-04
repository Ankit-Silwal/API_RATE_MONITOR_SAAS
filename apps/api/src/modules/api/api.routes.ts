import { createApiController, deleteApiController, getApiController } from "./api.controller";
import { Router } from "express";
import { requireAuth } from "../../middleware/auth";
import { generateApiKeyController } from "./apiKey.controller";
const router=Router();

router.post('/',requireAuth,createApiController);
router.get('/',requireAuth,getApiController);
router.delete('/:id',deleteApiController);

router.post('/:apiId/keys',requireAuth,generateApiKeyController);


export default router;