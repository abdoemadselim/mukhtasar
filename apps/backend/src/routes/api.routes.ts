import { Router } from "express"

import urlRoutes from "#features/url/routes/api.routes.js"
import swaggerUi from 'swagger-ui-express';
import swaggerApiDoc from "../../docs/APIdoc.json" with {type: "json"}

const router = Router()

// Swagger UI setup with options    
const swaggerOptions = {
    swaggerOptions: {
        showRequestDuration: true
    },
    customSiteTitle: "مُختصِر | API Doc"
};

// The API Doc
router.use('/docs', swaggerUi.serve);
router.get('/docs', swaggerUi.setup(swaggerApiDoc, swaggerOptions));

// Your API routes
router.use("/url", urlRoutes)

export default router;