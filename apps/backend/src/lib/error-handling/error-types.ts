export type FieldErrorsType = Record<string, { message: string }>
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
    static MESSAGE: string = "حدث خطأ غير متوقع في الخادم. يرجى المحاولة لاحقًا.";
    static ERROR_CODE_STRING: string = "INTERNAL_SERVER_ERROR";

    constructor() {
        super(
            InternalServerException.STATUS_CODE,
            InternalServerException.RESPONSE_CODE,
            InternalServerException.MESSAGE,
            "INTERNAL_SERVER_ERROR",
        );
    }
}

export class RateLimitingException extends HttpException {
    constructor() {
        super(429, 5, "لقد قمت بعدد كبير من الطلبات في وقت قصير. الرجاء الانتظار قليلاً ثم المحاولة مجددًا.", "RATE_LIMIT_EXCEEDED");
        this.name = this.constructor.name;
        Error.captureStackTrace(this);
    }
}

export class MethodNotAllowedException extends HttpException {
    constructor() {
        super(405, 2, "طريقة الطلب (HTTP Method) غير مسموح بها على هذا المسار.", "METHOD_NOT_ALLOWED");
        this.name = this.constructor.name;
        Error.captureStackTrace(this);
    }
}

export class UnAuthorizedException extends HttpException {
    constructor(message?: string) {
        super(401, 2, message || "غير مسموح لك بتنفيذ هذا الإجراء على هذا المورد.", "UNAUTHORIZED");
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
        super(422, 3, "خطأ في التحقق من صحة البيانات.", "VALIDATION_ERROR");
        this.FieldErrors = FieldErrors;
        this.errors = errors;

        this.name = this.constructor.name;
        Error.captureStackTrace(this);
    }
}

export class NoException {
    static NoErrorCode: number = 0;
    static NoErrorCodeString: string = "NO_ERROR"
}

export class ConflictException extends HttpException {
    constructor(message: string) {
        super(409, 7, message || "هناك تعارض مع حالة المورد الحالية.", "CONFLICT")

        this.name = this.constructor.name;
        Error.captureStackTrace(this);
    }
}

export class ResourceExpiredException extends HttpException {
    static STATUS_CODE: number = 401;
    static RESPONSE_CODE: number = 8;

    constructor(message: string) {
        super(401, 8, message || "انتهت صلاحية الوصول إلى هذا المورد.", "RESOURCE_EXPIRED")

        this.name = this.constructor.name;
        Error.captureStackTrace(this);
    }
}