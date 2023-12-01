import { UserServices } from './user.service';
import httpStatus from 'http-status';
import sendResponse from '../../utils/sendRespons';
import catchAsync from '../../utils/catchAsync';
// import { userValidationSchema } from './user.validationZod';

const createStudent = catchAsync(async (req, res) => {
  const { password, student: studentData } = req.body;

  const result = await UserServices.createStudneIntoDB(password, studentData);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'create a student successfully!',
    data: result,
  });
});

export const UserController = {
  createStudent,
};
