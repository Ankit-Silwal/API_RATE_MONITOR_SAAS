import { Router } from "express";
import { createOrganizationController } from "./organization.controller";
import { requireAuth } from "../../middleware/auth";

const router=Router();

router.post('/',requireAuth,createOrganizationController);

export default router;

