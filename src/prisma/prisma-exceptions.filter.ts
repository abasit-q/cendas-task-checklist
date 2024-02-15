import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

interface PrismaErrorInfo {
  status: HttpStatus;
  message: string;
}

const prismaErrorCodeMap: Record<string, PrismaErrorInfo> = {
  P2001: {
    status: HttpStatus.NOT_FOUND,
    message: `The record specified in the WHERE condition does not exist.`,
  },
  P2025: {
    status: HttpStatus.NOT_FOUND,
    message: `The record specified in the WHERE condition does not exist.`,
  },
  P2002: { status: HttpStatus.CONFLICT, message: `Unique constraint failed.` },
  P2003: {
    status: HttpStatus.CONFLICT,
    message: `Foreign key constraint failed.`,
  },
  P2004: {
    status: HttpStatus.CONFLICT,
    message: `A constraint failed on the database.`,
  },
  P2011: { status: HttpStatus.CONFLICT, message: `Null constraint violation.` },
  P2012: {
    status: HttpStatus.BAD_REQUEST,
    message: `Missing a required value.`,
  },
  P2015: {
    status: HttpStatus.CONFLICT,
    message: `A related record could not be found.`,
  },
  P2018: {
    status: HttpStatus.CONFLICT,
    message: `The required connected records were not found.`,
  },
};

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionsFilter extends BaseExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const errorInfo = prismaErrorCodeMap[exception.code];

    if (errorInfo) {
      response.status(errorInfo.status).json({
        statusCode: errorInfo.status,
        message: errorInfo.message,
        meta: exception.meta,
      });
    } else {
      super.catch(exception, host);
    }
  }
}
