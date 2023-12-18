import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import { appError } from '../errors/appError';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { TUserRole } from '../modules/user/user.interface';

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    //check if the client send token
    const token = req.headers.authorization;
    if (!token) {
      throw new appError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
    }
    //check if the client send invalid token
    // invalid token
    jwt.verify(
      token,
      config.jwt_access_token as string,
      function (err, decoded) {
        if (err) {
          throw new appError(
            httpStatus.UNAUTHORIZED,
            'You are not authorized!'
          );
        }

        //checking role
        const decodedRole = (decoded as JwtPayload)?.role;
        if (requiredRoles && !requiredRoles.includes(decodedRole)) {
          throw new appError(
            httpStatus.UNAUTHORIZED,
            'You are not authorized!'
          );
        }
        req.user = decoded as JwtPayload;
        next();
      }
    );
  });
};

export default auth;
