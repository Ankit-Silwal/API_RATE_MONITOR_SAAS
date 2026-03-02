import { Router } from "express";
import { createOrganizationController, getOrganizationsController } from "./organization.controller";
import { requireAuth } from "../../middleware/auth";

const router=Router();

router.post('/',requireAuth,createOrganizationController);
router.get('/',requireAuth,getOrganizationsController)

export default router;

