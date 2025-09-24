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

// ---------------------- Get User Active Domains ----------------------
export async function getUserActiveDomains(req: IRequest, res: Response) {
    //1- prepare the data for the service
    const userId = req.user?.id;

    //2- pass the data to the service
    const domains = await domainService.getUserActiveDomains(userId as number);

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
        user_id: userId as number,
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

// ---------------------- Refresh Domain Status ----------------------
export async function refreshDomain(req: IRequest, res: Response) {
    //1- prepare the data for the service
    const userId = req.user?.id;
    const { domainId } = req.params;

    //2- pass the data to the service
    const result = await domainService.refreshDomain(userId as number, Number(domainId));

    //3- prepare the response
    const response = {
        data: {
            domain: result
        },
        errors: [],
        code: NoException.NoErrorCode,
        errorCode: NoException.NoErrorCodeString,
    }

    res.json(response)
}

// ---------------------- Delete Domain ----------------------
export async function deleteDomain(req: IRequest, res: Response) {
    //1- prepare the data for the service
    const userId = req.user?.id;
    const { domainId } = req.params;

    //2- pass the data to the service
    const result = await domainService.deleteDomain(userId as number, Number(domainId));

    //3- prepare the response
    const response = {
        data: {
            domain: result
        },
        errors: [],
        code: NoException.NoErrorCode,
        errorCode: NoException.NoErrorCodeString,
    }

    res.json(response)
}
