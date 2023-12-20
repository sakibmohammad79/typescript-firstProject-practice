import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import { appError } from '../errors/appError';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { TUserRole } from '../modules/user/user.interface';
import { User } from '../modules/user/user.schema.model';

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    //check if the client send token
    const token = req.headers.authorization;
    if (!token) {
      throw new appError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
    }

    //check if the client send invalid token
    // invalid token - synchronous
    const decoded = jwt.verify(
      token,
      config.jwt_access_token as string
    ) as JwtPayload;

    const { role, userId, iat } = decoded;

    //check if the user is exists
    const user = await User.isUserExistsByCustomId(userId);
    if (!user) {
      throw new appError(httpStatus.NOT_FOUND, 'This user not found!');
    }
    //checking if the user delete status is true or (already deleted)
    const isDeletedUser = user.isDeleted;
    if (isDeletedUser) {
      throw new appError(httpStatus.FORBIDDEN, 'This user already deleted!');
    }
    //checking if the user blocked
    const userStatus = user.status;
    if (userStatus === 'blocked') {
      throw new appError(httpStatus.FORBIDDEN, 'This user is blocked!');
    }

    //if password change
    if (
      user.passwordChangeAt &&
      User.isJwtIssudBeforePasswordChange(user?.passwordChangeAt, iat as number)
    ) {
      throw new appError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
    }

    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new appError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
    }
    req.user = decoded as JwtPayload;
    next();
  });
};

export default auth;
