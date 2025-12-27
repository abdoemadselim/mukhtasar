import { Router } from "express"
import {
    createQrCode,
    // getQrCodeById,
    // getUserQrCodes,
    // deleteQrCode,
    // getQrAnalytics
} from "#features/qr/controllers/ui.controllers.js";
import { authSession } from "#features/auth/domain/auth.service.js";
import { CreateQrCodeSchema } from "#features/qr/domain/qr-schemas.js";
import validateRequest, { schemaWrapper } from "#lib/validation/validator-middleware.js";

const router = Router()

// Create QR Code
router.post("/",
    authSession(),
    validateRequest([schemaWrapper("body", CreateQrCodeSchema)]),
    createQrCode
)

// // Get all user QR codes
// router.get("/",
//     authSession(),
//     getUserQrCodes
// )

// // Get QR code by ID
// router.get("/:qrId",
//     authSession(),
//     validateRequest([schemaWrapper("params", QrCodeParamsSchema)]),
//     getQrCodeById
// )

// // Get QR code analytics
// router.get("/:qrId/analytics",
//     authSession(),
//     validateRequest([schemaWrapper("params", QrCodeParamsSchema)]),
//     getQrAnalytics
// )

// // Delete QR code
// router.delete("/:qrId",
//     authSession(),
//     validateRequest([schemaWrapper("params", QrCodeParamsSchema)]),
//     deleteQrCode
// )

export default router;