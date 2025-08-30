import { Router } from "express"
import swaggerUi from 'swagger-ui-express';

import urlRoutes from "#features/url/routes/api.routes.js"
import analyticsRoutes from "#features/analytics/routes/api.routes.js"
import { authToken } from "#features/token/domain/token-service.js";
import { READ_URL_PERMISSION } from "#features/token/data-access/const.js";

import swaggerApiDoc from "../../docs/api-doc.json" with {type: "json"}
import { apiRateLimiter } from "#lib/rate-limiting/rate-limiters.js";


const router = Router()

const customCss = `
    .info {
        text-align:right;
    }
    ul li {
        padding-top: 15px;
    }
    ul li::marker {
      content: "";
    }

`
// Swagger UI setup with options
const swaggerOptions = {
    swaggerOptions: {
        showRequestDuration: true
    },
    customSiteTitle: "مُختصِر | وثائق المبرمجين",
    customCss: customCss,
};

// The API Doc
router.use('/docs', swaggerUi.serve);
router.get('/docs', swaggerUi.setup(swaggerApiDoc, swaggerOptions));

// Your API routes
router.use("/url", urlRoutes)
router.use("/analytics", authToken(READ_URL_PERMISSION), apiRateLimiter(1, 150), analyticsRoutes)

export default router;