import { NextFunction, Request, Response } from "express"
import * as zod from "zod";

import { FieldErrorsType, ValidationException } from "#lib/error-handling/error-types.js"

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
                // The original form of result.error is array of objects
                // Here we're only interested in the errors (array of them)
                // So we flat them, but still ZOD returns object of two errors types (formErrors, fieldErrors) --> Only interested in fieldErrors
                const { fieldErrors, formErrors } = zod.flattenError(result.error)
                
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