import { Router } from "express";
import { sendContactMessage } from "#features/contact/controllers/ui.controllers.js";
import { contactMessageSchema } from "#features/contact/domain/contact.schemas.js";

import validateRequest from "#lib/validation/validator-middleware.js";
import { contactRateLimiter } from "#lib/rate-limiting/rate-limiters.js";

const router = Router();

router.post("/message",
    contactRateLimiter(15, 10),
    validateRequest([contactMessageSchema]),
    sendContactMessage
);

export default router;