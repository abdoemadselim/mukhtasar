import { Request } from "express";

export interface IRequest extends Request {
    body: {
        name: string;
        email: string;
        message: string;
    }
}