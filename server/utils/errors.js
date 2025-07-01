// errorHandler.js
class BadRequestError extends Error {
    constructor(message) {
      super(message);
      this.statusCode = 400;
    }
  }
  
  class NotFoundError extends Error {
    constructor(message) {
      super(message);
      this.statusCode = 404;
    }
  }
  
  const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
  
    // Log detailed error in development
    if (process.env.NODE_ENV === "development") {
      console.error(err.stack);
    }
  
    res.status(statusCode).json({
      success: false,
      error: message,
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
  };
  
  module.exports = {
    errorHandler,
    BadRequestError,
    NotFoundError,
  };