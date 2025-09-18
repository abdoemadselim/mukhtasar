import { Router } from "express"
import { getUserDomains, addDomain } from "#features/domain/controllers/ui.controllers.js";
import { authSession } from "#features/auth/domain/auth.service.js";
import { addDomainSchema } from "#features/domain/domain/domain-schemas.js"

import validateRequest from "#lib/validation/validator-middleware.js";

const router = Router()

router.get("/", authSession(), getUserDomains)
router.post("/",
    authSession(),
    validateRequest([addDomainSchema]),
    addDomain
)


export default router; 