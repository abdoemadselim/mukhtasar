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
// Swagger UI setup
const swaggerOptions = {
    swaggerOptions: {
        showRequestDuration: true
    },
    customSiteTitle: "مُختصِر | وثائق المبرمجين",
    customCss
};

// The API Doc
router.use('/docs', swaggerUi.serve);
router.get('/docs', swaggerUi.setup(swaggerApiDoc, swaggerOptions));

// The API routes
router.use("/url", apiRateLimiter(1, 100), urlRoutes)
router.use("/analytics", apiRateLimiter(1, 100), authToken(READ_URL_PERMISSION), analyticsRoutes)

export default router;