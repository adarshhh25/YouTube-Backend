class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something Went Wrong",
    errors = [],
    stack = ""
  ) {
    super(message); // Calls the parent Error constructor
    this.statusCode = statusCode; // HTTP status code (e.g., 404, 500)
    this.data = null; // Can be used for additional info if needed
    this.message = message; // Error message
    this.success = false; // Indicates the request was unsuccessful
    this.errors = errors; // Stores additional error details

    // Set custom stack trace if provided, otherwise capture it
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };
