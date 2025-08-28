import { Router } from "express"

import urlRoutes from "#features/url/routes/api.routes.js"
import swaggerUi from 'swagger-ui-express';
import swaggerApiDoc from "../../docs/api-doc.json" with {type: "json"}

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

export default router;