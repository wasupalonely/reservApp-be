import boom from '@hapi/boom';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

const errorHandler = (error, req, res, next) => {
  console.error('Error handler received:', {
    message: error.message,
    stack: error.stack,
    data: error.data,
    isBoom: error.isBoom,
    code: error.code
  });

  let boomError;

  if (boom.isBoom(error)) {
    boomError = error;
  } 
  else if (error instanceof PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        boomError = boom.conflict('Duplicate entry', {
          target: error.meta?.target,
          prismaCode: error.code
        });
        break;
      case 'P2025':
        boomError = boom.notFound('Resource not found', {
          prismaCode: error.code
        });
        break;
      default:
        boomError = boom.badImplementation('Database error', {
          prismaCode: error.code,
          meta: error.meta
        });
    }
  } 
  else {
    boomError = boom.boomify(error, {
      statusCode: error.statusCode || 500,
      data: {
        originalError: error.message,
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
      }
    });
  }

  const response = {
    ...boomError.output.payload,
    ...boomError.data
  };

  return res.status(boomError.output.statusCode).json(response);
};

export default errorHandler;