import { NextFunction, Request, Response } from "express"
import * as zod from "zod";

import { FieldErrorsType, ValidationException } from "../error-handling/error-types.js"

type SchemaDataType = "body" | "query" | "params";

// It takes multiple schemas and compares each data against it (e.g. body sent to create url endpoint VS createUrlBodySchema)
// TODO: Why not passing the data to be validated instead of passing type of data? To REFACTOR
function validateRequest(schemas: { schemaDataType: SchemaDataType, schemaObject: zod.ZodObject }[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        schemas.forEach(({ schemaDataType, schemaObject }) => {
            const data = schemaDataType == "body" ? req.body : schemaDataType == "query" ? req.query : req.params;
            const result = schemaObject.safeParse(data)

            // If there're ZOD validation errors
            if (!result.success) {
                const fieldErrors = result.error.issues.reduce((acc, issue) => {
                    const field = issue.path[0] as string;
                    acc[field] = { message: issue.message };
                    return acc;
                }, {} as Record<string, { message: string }>);


                const { formErrors } = zod.flattenError(result.error);
                throw new ValidationException(fieldErrors as FieldErrorsType, formErrors)
            }
        })
        next()
    }
}

export function schemaWrapper(schemaDataType: SchemaDataType, schemaObject: zod.ZodObject) {
    return {
        schemaDataType,
        schemaObject
    }
}

export default validateRequest;