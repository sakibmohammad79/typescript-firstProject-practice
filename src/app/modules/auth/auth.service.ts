import httpStatus from 'http-status';
import { appError } from '../../errors/appError';
import { User } from '../user/user.schema.model';
import { TLoginUser } from './auth.interface';
import jwt from 'jsonwebtoken';
import config from '../../config';

const loginUser = async (payload: TLoginUser) => {
  //check if the user is exists
  const user = await User.isUserExistsByCustomId(payload?.id);
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

  //checking if the password is correct
  if (!(await User.isPasswordMatched(payload?.password, user?.password))) {
    throw new appError(httpStatus.FORBIDDEN, 'Password  do not matched!');
  }
  //create Token and send to the client
  const jwtPayload = {
    userId: user.id,
    role: user.role,
  };
  const accessToken = jwt.sign(jwtPayload, config.jwt_access_token as string, {
    expiresIn: '10d',
  });
  return {
    accessToken,
    needPasswordChange: user?.needsPasswordChnage,
  };
};

export const authServices = {
  loginUser,
};
