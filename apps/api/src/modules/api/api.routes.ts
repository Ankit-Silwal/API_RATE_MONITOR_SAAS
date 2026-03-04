import { createApiController, deleteApiController, getApiController } from "./api.controller";
import { Router } from "express";
import { requireAuth } from "../../middleware/auth";
import { generateApiKeyController } from "./apiKey.controller";
import { trackUsageController } from "./track.controller";
import { getApiStatsController } from "./analytics.controller";

const router=Router();

router.post('/',requireAuth,createApiController);
router.get('/',requireAuth,getApiController);
router.delete('/:id',deleteApiController);

router.post('/:apiId/keys',requireAuth,generateApiKeyController);

router.post("/track",requireAuth,trackUsageController)

router.get('/apis/:apiId/stats',requireAuth,getApiStatsController);

export default router;