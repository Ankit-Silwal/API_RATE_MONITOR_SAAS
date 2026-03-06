import { createApiController, deleteApiController, getApiController } from "./api.controller";
import { Router } from "express";
import { requireAuth } from "../../middleware/auth";
import { generateApiKeyController, getApiKeysController, revokeApiKeyController } from "./apiKey.controller";
import { trackUsageController } from "./track.controller";
import { getApiStatsController, getEndPointUsageController, getRequestPerMinuteController } from "./analytics.controller";
import { verifyApiOwnership } from "../../middleware/verifyApiOwnership";

const router=Router();

router.post('/', requireAuth, createApiController);
router.get('/', requireAuth, getApiController);
router.delete('/:apiId', requireAuth, verifyApiOwnership, deleteApiController);
 
router.post('/:apiId/keys', requireAuth, verifyApiOwnership, generateApiKeyController);
router.get('/:apiId/keys', requireAuth, verifyApiOwnership, getApiKeysController);
router.delete('/:apiId/keys/:keyId', requireAuth, verifyApiOwnership, revokeApiKeyController);

router.post("/track", trackUsageController);


router.get('/:apiId/stats', requireAuth, verifyApiOwnership, getApiStatsController);
router.get('/:apiId/endpoints', requireAuth, verifyApiOwnership, getEndPointUsageController);
router.get("/:apiId/rpm", requireAuth, verifyApiOwnership, getRequestPerMinuteController);

export default router;