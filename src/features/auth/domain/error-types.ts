import { HttpException } from "#lib/error-handling/error-types.js";

export class LoginException extends HttpException {
    constructor() {
        super(401, 10, "Invalid Email or password.", "LOGIN_EXCEPTION");

        this.name = this.constructor.name;
        Error.captureStackTrace(this);
    }
}

export class UnVerifiedException extends HttpException {
    constructor(){
        super(403, 11, "Email is unverified", "EMAIL_UNVERIFIED");

        this.name = this.constructor.name;
        Error.captureStackTrace(this);
    }
}