/* eslint-disable @typescript-eslint/no-explicit-any */
import { studentServices } from './student.service';
import sendResponse from '../../utils/sendRespons';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';

const getAllStudent = catchAsync(async (req, res) => {
  const result = await studentServices.getAllStudentIntoDB(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'get all student successfully!',
    meta: result.meta,
    data: result.result,
  });
});

const getSingleStudent = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await studentServices.getSingleStudentIntoDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'get single student successfully!',
    data: result,
  });
});

const updateStudent = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { student } = req.body;
  const result = await studentServices.updateStudentIntoDB(id, student);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'student is updated successfully!',
    data: result,
  });
});
const deleteStudent = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await studentServices.deleteStudentFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'student delete successfully!',
    data: result,
  });
});
export const studentController = {
  getAllStudent,
  getSingleStudent,
  deleteStudent,
  updateStudent,
};
