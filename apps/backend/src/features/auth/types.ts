import { Request } from "express";

export interface IRequest extends Request {
    user?: {
        name: string
        email: string,
        verified: boolean,
        id: number
    }
}
