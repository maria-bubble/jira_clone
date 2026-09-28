import { ErrorRequestHandler } from 'express';
import { pick } from 'lodash';

import { CustomError } from 'errors';

export const handleError: ErrorRequestHandler = (error, _req, res, _next) => {
  const isErrorSafeForClient = error instanceof CustomError;

  // Only log unexpected errors; expected client errors (4xx) are handled silently
  if (!isErrorSafeForClient) {
    console.error(error);
  }

  const clientError = isErrorSafeForClient
    ? pick(error, ['message', 'code', 'status', 'data'])
    : {
        message: 'Something went wrong, please contact our support.',
        code: 'INTERNAL_ERROR',
        status: 500,
        data: {},
      };

  res.status(clientError.status).send({ error: clientError });
};
