import { NotFoundException } from "../../../lib/error-handling/error-types.js";

export class URLNotFoundException extends NotFoundException {
    constructor() {
        super("Short URL not found.", "URL_NOT_FOUND_EXCEPTION");

        this.name = this.constructor.name; // For debugging (It's easy now to see the error kind (e.g. URLNotFoundException))
        Error.captureStackTrace(this); // To start the stack trace from this class and omits the parent class (for easy debugging)
    }
}
