import { ErrorRequestHandler, Response } from "express";
import { z } from "zod";

import { AppError } from "../common/utils/app-error";
import { HTTPSTATUS } from "../configs/http.config";

const formatZodError = (res: Response, error: z.ZodError): void => {
  const errors = error?.issues?.map((err) => ({
    field: err.path.join("."),
    message: err.message,
  }));
  res.status(HTTPSTATUS.BAD_REQUEST).json({
    message: "Validation failed",
    errors: errors,
  });
};

export const errorHandler: ErrorRequestHandler = (
  error,
  req,
  res,

  _next,
) => {
  console.error(`Error occured on PATH: ${req.path}`, error);

  if (error instanceof SyntaxError) {
    res.status(HTTPSTATUS.BAD_REQUEST).json({
      message: "Invalid JSON format, please check your request body",
    });
    return;
  }

  if (error instanceof z.ZodError) {
    formatZodError(res, error);
    return;
  }

  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      message: error.message,
      errorCode: error.errorCode,
    });
    return;
  }

  res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
    message: "Internal Server Error",
    error: error?.message || "Unknown error occurred",
  });
};
