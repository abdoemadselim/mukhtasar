import { Router } from "express"
import { getUserDomains, addDomain, refreshDomain, deleteDomain, getUserActiveDomains } from "#features/domain/controllers/ui.controllers.js";
import { authSession } from "#features/auth/domain/auth.service.js";
import { addDomainSchema } from "#features/domain/domain/domain-schemas.js"

import validateRequest from "#lib/validation/validator-middleware.js";

const router = Router()

router.get("/", authSession(), getUserDomains)

router.get("/active", authSession(), getUserActiveDomains)

router.post("/",
    // authSession(),
    validateRequest([addDomainSchema]),
    addDomain
)

router.post("/:domainId/refresh",
    authSession(),
    refreshDomain
)

router.delete("/:domainId",
    authSession(),
    deleteDomain
)

export default router; 