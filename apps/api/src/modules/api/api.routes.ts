import { createApiController, deleteApiController, getApiController } from "./api.controller";
import { Router } from "express";
import { requireAuth } from "../../middleware/auth";
import { generateApiKeyController, getApiKeysController, revokeApiKeyController } from "./apiKey.controller";
import { trackUsageController } from "./track.controller";
import { getApiStatsController, getEndPointUsageController, getRequestPerMinuteController } from "./analytics.controller";

const router=Router();

router.post('/',requireAuth,createApiController);
router.get('/',requireAuth,getApiController);
router.delete('/:id',deleteApiController);

router.post('/:apiId/keys',requireAuth,generateApiKeyController);

router.post("/track",requireAuth,trackUsageController)

router.get('/:apiId/stats',requireAuth,getApiStatsController);
router.get('/:apiId/endpoints',getEndPointUsageController)

router.get("/:apiId/rpm",getRequestPerMinuteController)

router.get("/:apiId/keys",getApiKeysController)
router.delete("/:apiId/keys/:keyId",revokeApiKeyController)

export default router;