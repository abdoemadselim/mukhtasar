export type FieldErrorsType = Record<string, string[]>
export class HttpException extends Error {
    statusCode: number;
    responseCode: number;
    errorCodeString: string;

    constructor(statusCode: number, responseCode: number, message: string, errorCodeString: string) {
        super(message);

        this.statusCode = statusCode;
        this.responseCode = responseCode;
        this.errorCodeString = errorCodeString

        this.name = this.constructor.name; // For debugging (It's easy now to see the error kind (e.g. RateLimitingException))
        Error.captureStackTrace(this); // To start the stack trace from this class and omits the parent class
    }
}

export class InternalServerException extends HttpException {
    static STATUS_CODE: number = 500;
    static RESPONSE_CODE: number = 4;
    static MESSAGE: string = "Something went wrong";
    static ERROR_CODE_STRING: string = "INTERNAL_SERVER_ERROR";

    constructor() {

        super(InternalServerException.STATUS_CODE, InternalServerException.RESPONSE_CODE, InternalServerException.MESSAGE, "INTERNAL_SERVER_ERROR",);
    }
}

export class RateLimitingException extends HttpException {
    constructor() {
        super(429, 5, "Rate limit exceeded. Please try again later.", "RATE_LIMIT_EXCEEDED");
        this.name = this.constructor.name;
        Error.captureStackTrace(this);
    }
}

export class MethodNotAllowedException extends HttpException {
    constructor() {
        super(405, 2, "This HTTP method is not allowed on this endpoint.", "METHOD_NOT_ALLOWED");
        this.name = this.constructor.name;
        Error.captureStackTrace(this);
    }
}

export class UnAuthorizedException extends HttpException {
    constructor() {
        super(401, 2, "You are not authorized to access this resource.", "UNAUTHORIZED");
        this.name = this.constructor.name;
        Error.captureStackTrace(this);
    }
}

export class NotFoundException extends HttpException {
    constructor(message: string, errorCodeString?: string) {
        super(404, 6, message, errorCodeString || "NOT_FOUND")
        this.name = this.constructor.name;
        Error.captureStackTrace(this);
    }
}

export class ValidationException extends HttpException {
    FieldErrors: FieldErrorsType
    errors?: string[]
    constructor(FieldErrors: FieldErrorsType, errors?: string[]) {
        super(422, 3, "Validation Exception", "VALIDATION_ERROR");
        this.FieldErrors = FieldErrors;
        this.errors = errors;

        this.name = this.constructor.name;
        Error.captureStackTrace(this);
    }
}

export class NoException {
    static NoErrorCode: number = 0;
}

export class ConflictException extends HttpException {
    constructor(message: string) {
        super(409, 7, message, "CONFLICT")

        this.name = this.constructor.name;
        Error.captureStackTrace(this);
    }
}

export class ResourceExpiredException extends HttpException {
    static STATUS_CODE: number = 401;
    static RESPONSE_CODE: number = 8;

    constructor(message: string) {
        super(401, 8, message, "RESOURCE_EXPIRED")

        this.name = this.constructor.name;
        Error.captureStackTrace(this);
    }
}