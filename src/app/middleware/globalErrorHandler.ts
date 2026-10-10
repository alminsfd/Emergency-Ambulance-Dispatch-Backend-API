import {
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/client";
import type { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { ZodError } from "zod";
import config from "../config";
import { AppError } from "../utils/AppError";

export const globalErrorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (config.nodeEnv === "development") {
    console.log(" Error from Global Error Handler:", err);
  }

  let statusCode: number = httpStatus.INTERNAL_SERVER_ERROR;
  let message: string = err.message || "Something went wrong";
  let errorSources: Array<{ path: string; message: string }> = [];

  // 1. Custom Operational Errors
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errorSources = [
      {
        path: "",
        message: err.message,
      },
    ];
  }
  // 2. Zod Validation Error
  else if (err instanceof ZodError) {
    statusCode = httpStatus.BAD_REQUEST;
    message = "Validation Error";
    errorSources = err.issues.map((issue) => ({
      path: issue.path[issue.path.length - 1]?.toString() || "",
      message: issue.message,
    }));
  }
  // 3. Prisma Known Request Errors
  else if (err instanceof PrismaClientKnownRequestError) {
    statusCode = httpStatus.BAD_REQUEST;
    if (err.code === "P2002") {
      message = "Duplicate Key Error";
      errorSources = [
        {
          path: (err.meta?.target as string) || "field",
          message: `${err.meta?.target || "Field"} already exists!`,
        },
      ];
    } else if (err.code === "P2003") {
      message = "Foreign key constraint failed";
      errorSources = [
        {
          path: "",
          message: "Foreign key constraint failed on the database",
        },
      ];
    } else if (err.code === "P2025") {
      message = "Record not found";
      errorSources = [
        {
          path: "",
          message:
            "An operation failed because it depends on one or more records that were required but not found.",
        },
      ];
    }
  }
  // 4. Prisma Validation Error
  else if (err instanceof PrismaClientValidationError) {
    statusCode = httpStatus.BAD_REQUEST;
    message = "Incorrect field type provided or missing required fields";
    errorSources = [
      {
        path: "",
        message: err.message,
      },
    ];
  }
  // 5. Prisma Connection / Initialization Error
  else if (err instanceof PrismaClientInitializationError) {
    if (err.errorCode === "P1000") {
      statusCode = httpStatus.UNAUTHORIZED;
      message = "Authentication failed against database server";
    } else if (err.errorCode === "P1001") {
      statusCode = httpStatus.BAD_REQUEST;
      message = "Cannot reach database server";
    }
  }
  // 6. Prisma Unknown Request Error
  else if (err instanceof PrismaClientUnknownRequestError) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = "Error occurred during database query execution";
  }
  // 7. General JS Errors
  else if (err instanceof Error) {
    message = err.message;
    errorSources = [
      {
        path: "",
        message: err.message,
      },
    ];
  }

  // Mandatory JSON Response Format
  return res.status(statusCode).json({
    success: false,
    message,
    errors: errorSources.length > 0 ? errorSources : undefined,
    stack: config.nodeEnv === "development" ? err?.stack : undefined,
  });
};