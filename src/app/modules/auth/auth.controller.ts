import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendRespons';
import { authServices } from './auth.service';
import config from '../../config';

const loginUser = catchAsync(async (req, res) => {
  const result = await authServices.loginUser(req.body);
  const { refreshToken, accessToken, needsPasswordChange } = result;
  res.cookie('refreshToken', refreshToken, {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
  });
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'User is loggedIn successfully!',
    data: {
      accessToken,
      needsPasswordChange,
    },
  });
});
const changePassword = catchAsync(async (req, res) => {
  //console.log(req.user, req.body)
  const { ...passwordData } = req.body;
  const result = await authServices.changePassword(req.user, passwordData);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'password is updated successfully!',
    data: result,
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const result = await authServices.refreshToken(refreshToken);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Access token retrieved successfully!',
    data: result,
  });
});
const forgetPassword = catchAsync(async (req, res) => {
  const userId = req.body.id;
  const result = await authServices.forgetPassword(userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Reset link generated successfully!',
    data: result,
  });
});

const resetPassword = catchAsync(async (req, res) => {
  console.log(req.body);
  const token = req.headers.authorization;
  console.log(token);
  const result = await authServices.resetPassword(req.body, token);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'password reset successfully!',
    data: result,
  });
});

export const authController = {
  loginUser,
  changePassword,
  refreshToken,
  forgetPassword,
  resetPassword,
};
