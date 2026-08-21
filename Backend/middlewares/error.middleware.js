const ApiError = require("../utils/ApiError");

// Known Prisma error codes -> safe, user-readable messages.
// (Raw Prisma errors mention table/column names and internal query details
// that we never want to send straight to the browser.)
const PRISMA_ERROR_MAP = {
  P2002: {
    statusCode: 409,
    message: "A record with these details already exists.",
  },
  P2003: {
    statusCode: 400,
    message: "This action refers to a related record that doesn't exist.",
  },
  P2014: {
    statusCode: 400,
    message: "This action would break a required relationship between records.",
  },
  P2025: {
    statusCode: 404,
    message: "The record you're looking for couldn't be found.",
  },
};

// Convert *any* error thrown/passed to next() into a safe ApiError.
// This is the single place responsible for making sure the client never
// sees a raw stack trace, a Prisma message, or a bare "Internal Server Error".
const toApiError = (err) => {
  if (err instanceof ApiError) {
    return err;
  }

  // Prisma "known request" errors (unique constraint, missing relation, etc.)
  if (err.code && PRISMA_ERROR_MAP[err.code]) {
    const mapped = PRISMA_ERROR_MAP[err.code];
    return new ApiError(mapped.statusCode, mapped.message, [], err.stack);
  }

  // Prisma validation errors (wrong field types/shape sent to the query engine)
  if (err.name === "PrismaClientValidationError") {
    return new ApiError(
      400,
      "The request contains invalid or missing data.",
      [],
      err.stack,
    );
  }

  // Malformed JSON body from express.json()
  if (err.type === "entity.parse.failed") {
    return new ApiError(
      400,
      "The request body isn't valid JSON.",
      [],
      err.stack,
    );
  }

  // CORS rejection thrown in app.js
  if (err.message === "Not allowed by CORS") {
    return new ApiError(
      403,
      "This request isn't allowed from your origin.",
      [],
      err.stack,
    );
  }

  // Anything else is an *unexpected* error (bug, DB connection issue, etc.).
  // Only trust a statusCode that was deliberately set on the error; everything
  // else is treated as a 500 and gets a generic message so we never leak
  // internal details like stack traces or raw exception text to the client.
  const hasDeliberateStatusCode =
    Number.isInteger(err.statusCode) &&
    err.statusCode >= 400 &&
    err.statusCode < 600;
  const statusCode = hasDeliberateStatusCode ? err.statusCode : 500;
  const message = hasDeliberateStatusCode
    ? err.message || "Something went wrong."
    : "Something went wrong on our end. Please try again in a moment.";

  return new ApiError(statusCode, message, err?.errors || [], err.stack);
};

const errorHandler = (err, req, res, next) => {
  const error = toApiError(err);

  // Always log the *original* error server-side (with stack) for debugging,
  // regardless of what the client is shown.
  if (error.statusCode >= 500) {
    console.error(`[${req.method} ${req.originalUrl}]`, err);
  }

  // Send the error response.
  // Hide stack traces in production for security, but allow them in development for easier debugging
  const response = {
    ...error,
    message: error.message,
    ...(process.env.NODE_ENV === "development" ? { stack: err.stack } : {}),
  };

  return res.status(error.statusCode).json(response);
};

module.exports = errorHandler;
