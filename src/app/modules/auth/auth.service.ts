import httpStatus from 'http-status';
import { appError } from '../../errors/appError';
import { User } from '../user/user.schema.model';
import { TLoginUser } from './auth.interface';
import { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import bcrypt from 'bcrypt';
import { createToken } from './auth.utils';
import jwt from 'jsonwebtoken';
import { sendMail } from '../../utils/sendEmail';

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
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_token as string,
    config.jwt_access_expires_in as string
  );
  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_token as string,
    config.jwt_refresh_expires_in as string
  );
  return {
    accessToken,
    refreshToken,
    needsPasswordChange: user?.needsPasswordChnage,
  };
};

const changePassword = async (
  userData: JwtPayload,
  payload: { oldPassword: string; newPassword: string }
) => {
  //check if the user is exists
  const user = await User.isUserExistsByCustomId(userData.userId);
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
  if (!(await User.isPasswordMatched(payload?.oldPassword, user?.password))) {
    throw new appError(httpStatus.FORBIDDEN, 'Password  do not matched!');
  }

  const newHashedPassword = await bcrypt.hash(
    payload?.newPassword,
    Number(config.bycrypt_salt_rounds)
  );

  await User.findOneAndUpdate(
    {
      id: userData.userId,
      role: userData.role,
    },
    {
      password: newHashedPassword,
      needsPasswordChnage: false,
      passwordChangeAt: new Date(),
    }
  );
  return null;
};

const refreshToken = async (token: string) => {
  //check if the client send invalid token
  // invalid token - synchronous
  const decoded = jwt.verify(
    token,
    config.jwt_refresh_token as string
  ) as JwtPayload;

  const { userId, iat } = decoded;

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

  //create Token and send to the client
  const jwtPayload = {
    userId: user.id,
    role: user.role,
  };
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_token as string,
    config.jwt_access_expires_in as string
  );
  return {
    accessToken,
  };
};

const forgetPassword = async (userId: string) => {
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

  //create Token and send to the client
  const jwtPayload = {
    userId: user.id,
    role: user.role,
  };
  const resetToken = createToken(
    jwtPayload,
    config.jwt_access_token as string,
    '10m'
  );

  const resetUILink = `${config.reset_password_ui_link}?id=${user.id}&token=${resetToken}`;
  console.log(resetUILink);

  sendMail(user.email, resetUILink);
};

export const authServices = {
  loginUser,
  changePassword,
  refreshToken,
  forgetPassword,
};
