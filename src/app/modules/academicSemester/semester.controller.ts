import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendRespons';
import { academicSemesterServices } from './semester.service';

const createAcademicSemester = catchAsync(async (req, res) => {
  const result = await academicSemesterServices.createAcademicSemesterIntoDB(
    req.body
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'academic-semester created successfully!',
    data: result,
  });
});
const getAllAcademicSemester = catchAsync(async (req, res) => {
  const result = await academicSemesterServices.getAllAcademicSemesterInotDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All academic semester get successfully!',
    meta: result.meta,
    data: result.result,
  });
});
const getSingleAcademicSemester = catchAsync(async (req, res) => {
  const { semesterId } = req.params;
  const result = await academicSemesterServices.getSingleAcademicSemesterInotDB(
    semesterId
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Single academic semester get successfully!',
    data: result,
  });
});

const updateAcademicSemester = catchAsync(async (req, res) => {
  const { semesterId } = req.params;
  const result = await academicSemesterServices.updateAcademicSemesterIntoDB(
    semesterId,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic semester is retrieved succesfully',
    data: result,
  });
});

export const academicSemesterControllers = {
  createAcademicSemester,
  getAllAcademicSemester,
  getSingleAcademicSemester,
  updateAcademicSemester,
};
