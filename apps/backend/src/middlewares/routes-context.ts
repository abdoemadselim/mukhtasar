import { AsyncLocalStorage } from "node:async_hooks";
import { randomUUID } from "node:crypto";
import { NextFunction, Request, Response } from "express";

export const asyncStore = new AsyncLocalStorage<{ requestId: string, tokenId: string }>()

/** Attach a requestId for each coming request, so all subsequent logs for
 *  a particular request has the same requestId attached to them (correlated request id)
 *
 * asyncLocalStorage is used here, so all methods under a particular request has access to the store (its requestId and tokenId),
 * they are both needed for logging
*/
const routesContext = (req: Request, res: Response, next: NextFunction) => {
    const requestId = randomUUID();
    const token = req.headers.authorization?.split(" ")[1];
    const tokenId = token ? `${token.slice(0, 6)}...` : "";

    asyncStore.run({ requestId, tokenId }, next)
}

export default routesContext