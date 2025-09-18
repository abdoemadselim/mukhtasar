import type { Response } from "express";
import { IRequest } from "#features/domain/types.js";
import * as domainService from "#features/domain/domain/domain.service.js";
import { NoException } from "#root/lib/error-handling/error-types.js";

// ---------------------- LOGIN ----------------------
export async function getUserDomains(req: IRequest, res: Response) {
    //1- prepare the data for the service
    const userId = req.user?.id;

    //2- pass the data to the service
    const domains = await domainService.getUserDomains(userId as number);

    //3- prepare the response
    const response = {
        data: {
            domains
        },
        errors: [],
        code: NoException.NoErrorCode,
        errorCode: NoException.NoErrorCodeString,
    }

    res.json(response)
}
