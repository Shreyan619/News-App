class apiResponse {
    constructor(statusCode, message = "success") {
        this.message = message
        this.statusCode = statusCode
        this.success = statusCode < 400
    }
}

export { apiResponse }