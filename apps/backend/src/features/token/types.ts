import { Request } from "express";

export type TokenPermission = "can_read" | "can_create" | "can_update" | "can_delete";

export type TokenInput = {
    can_create: boolean;
    can_update: boolean;
    can_delete: boolean;
    label?: string;
    user_id: number;
};

export type Token = TokenInput & {
    id: string;
    created_at?: Date;
};

export type TokenWithUrlType = Token & {
    alias: string,
    domain: string
}

export interface IRequest extends Request {
    user?: {
        id: number
    },
    params: {
        alias?: string,
        domain?: string,
        tokenId?: string
    },
    query: {
        alias?: string,
        pageSize?: string,
        page?: string
    }
}

