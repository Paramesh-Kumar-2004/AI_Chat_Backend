

class ApiError extends Error {
    constructor(statusCode, message) {
        super(message)
        this.statusCode = statusCode

        // Capture stack trace (helps debugging, skipped in response)
        Error.captureStackTrace(this, this.constructor)
    }
}

export default ApiError
