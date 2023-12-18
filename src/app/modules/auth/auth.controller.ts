import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendRespons';
import { authServices } from './auth.service';

const loginUser = catchAsync(async (req, res) => {
  const result = await authServices.loginUser(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'User is loggedIn successfully!',
    data: result,
  });
});

export const authController = {
  loginUser,
};
