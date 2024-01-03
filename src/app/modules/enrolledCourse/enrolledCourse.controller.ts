import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendRespons';
import { EnrolledCourseServices } from './enrolledCourse.service';

const createEnrolledCourse = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await EnrolledCourseServices.createEnrolledCourseIntoDB(
    userId,
    req.body
  );
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Create enrolled course succesfully',
    data: result,
  });
});

//update marks
const updateEnrolledCourseMarks = catchAsync(async (req, res) => {
  const facultyId = req.user.userId;
  const result = await EnrolledCourseServices.updateEnrolledCourseMarksIntoDb(
    facultyId,
    req.body
  );
  sendResponse(res, {
    statusCode: httpStatus.UPGRADE_REQUIRED,
    success: true,
    message: 'Enrolled Course Marks update successfully!',
    data: result,
  });
});

export const EnrolledCourseController = {
  createEnrolledCourse,
  updateEnrolledCourseMarks,
};
