import boom from '@hapi/boom';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export const authenticate = (roles = []) => {
    return (req, res, next) => {
      try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
          throw boom.unauthorized('Missing token');
        }
  
        const decoded = jwt.verify(token, JWT_SECRET);
        
        if (roles.length && !roles.includes(decoded.role)) {
          throw boom.forbidden('Insufficient permissions');
        }
  
        req.user = decoded;
        next();
      } catch (error) {
        if (error.name === 'TokenExpiredError') {
          next(boom.unauthorized('Token expired'));
        } else if (error.name === 'JsonWebTokenError') {
          next(boom.unauthorized('Invalid token'));
        } else {
          next(error);
        }
      }
    };
  };