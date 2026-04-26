class AppError extends Error {
    constructor(message, statusCode = 500, details = null, code = null) {
        super(message);

        this.statusCode = statusCode;
        this.details = details;
        this.code = code;

        this.success = false;

        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;