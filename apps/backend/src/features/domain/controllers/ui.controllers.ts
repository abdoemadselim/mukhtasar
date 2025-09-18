import type { Response } from "express";
import { IRequest } from "#features/domain/types.js";
import * as domainService from "#features/domain/domain/domain.service.js";

import { NoException } from "#lib/error-handling/error-types.js";

// ---------------------- Get User Domains ----------------------
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

// ---------------------- Register New Domain ----------------------
export async function addDomain(req: IRequest, res: Response) {
    //1- prepare the data for the service
    const userId = req.user?.id;
    const { domain } = req.body;

    //2- pass the data to the service
    const createdDomain = await domainService.addDomain({
        domain,
        user_id: userId as number
    });

    //3- prepare the response
    const response = {
        data: {
            domain: createdDomain
        },
        errors: [],
        code: NoException.NoErrorCode,
        errorCode: NoException.NoErrorCodeString,
    }

    res.status(201).json(response)
}
