import httpStatus from 'http-status';
import { appError } from '../../errors/appError';
import { SemesterRegistration } from '../semesterRegistration/semesterRegistration.model';
import { TOfferCourse } from './offeredCourse.interface';
import { OfferedCourse } from './offeredCourse.model';
import { AcademicFaculty } from '../academicFaculty/faculty.model';
import { AcademicDepartment } from '../academicDepartment/department.model';
import { Course } from '../course/course.model';
import { Faculty } from '../faculty/faculty.model';

const createOfferedCourseIntoDB = async (payload: TOfferCourse) => {
  const {
    semesterRegistration,
    academicFaculty,
    academicDepartment,
    course,
    faculty,
  } = payload;
  //check if semester registration id is exists
  const isSemesterRegistrationExists = await SemesterRegistration.findById(
    semesterRegistration
  );

  if (!isSemesterRegistrationExists) {
    throw new appError(
      httpStatus.NOT_FOUND,
      'The Semester Registration not found!'
    );
  }

  //academic semester find
  const academicSemester = isSemesterRegistrationExists.academicSemester;

  //check if academic faculty id is exists
  const isAcademicFacultyExists = await AcademicFaculty.findById(
    academicFaculty
  );

  if (!isAcademicFacultyExists) {
    throw new appError(httpStatus.NOT_FOUND, 'The academic faculty not found!');
  }
  //check if academic department id is exists
  const isAcademicDepartmentExists = await AcademicDepartment.findById(
    academicDepartment
  );

  if (!isAcademicDepartmentExists) {
    throw new appError(
      httpStatus.NOT_FOUND,
      'The academic department not found!'
    );
  }
  //check if course id is exists
  const isCourseExists = await Course.findById(course);

  if (!isCourseExists) {
    throw new appError(httpStatus.NOT_FOUND, 'The course not found!');
  }
  //check if faculty id is exists
  const isFacultyExists = await Faculty.findById(faculty);

  if (!isFacultyExists) {
    throw new appError(httpStatus.NOT_FOUND, 'The faculty not found!');
  }

  const result = await OfferedCourse.create({ ...payload, academicSemester });
  return result;
};

const getAllOfferedCourseFromDB = async (query: Record<string, unknown>) => {
  //   const semesterRegistrationQuery = new queryBuilder(
  //     SemesterRegistration.find().populate('academicSemester'),
  //     query
  //   )
  //     .filter()
  //     .sort()
  //     .paginate()
  //     .fields();
  //   const result = await semesterRegistrationQuery.modelQuery;
  //   return result;
};

const getSingleOfferedCourseFromDB = async (id: string) => {
  const result = await OfferedCourse.findById(id);
  return result;
};

const updateOfferedCourseInotDB = async (
  id: string,
  payload: Partial<TSemesterRegistration>
) => {
  //check if the requested registered semester is exists
  //   const isRequestedSmesterRegistrationExists =
  //     await SemesterRegistration.findById(id);
  //   if (!isRequestedSmesterRegistrationExists) {
  //     throw new appError(
  //       httpStatus.BAD_REQUEST,
  //       'The requested smester not found!'
  //     );
  //   }
  //   //check if the requested semester registration status 'Ended', will no updated anything.
  //   const currentSemesterStatus = isRequestedSmesterRegistrationExists.status;
  //   const requestedSemesterStatus = payload?.status;
  //   if (currentSemesterStatus === registrationStatus.ENDED) {
  //     throw new appError(
  //       httpStatus.BAD_REQUEST,
  //       `This semester is already ${currentSemesterStatus}`
  //     );
  //   }
  //   if (
  //     currentSemesterStatus === registrationStatus.UPCOMING &&
  //     requestedSemesterStatus === registrationStatus.ENDED
  //   ) {
  //     throw new appError(
  //       httpStatus.BAD_REQUEST,
  //       `You can not directly change status from  ${currentSemesterStatus} to ${requestedSemesterStatus}`
  //     );
  //   }
  //   if (
  //     currentSemesterStatus === registrationStatus.ONGOING &&
  //     requestedSemesterStatus === registrationStatus.UPCOMING
  //   ) {
  //     throw new appError(
  //       httpStatus.BAD_REQUEST,
  //       `You can not directly change status from  ${currentSemesterStatus} to ${requestedSemesterStatus}`
  //     );
  //   }
  //   const result = await SemesterRegistration.findByIdAndUpdate(id, payload, {
  //     new: true,
  //     runValidators: true,
  //   });
  //   return result;
};

export const offeredCourseServices = {
  createOfferedCourseIntoDB,
  getAllOfferedCourseFromDB,
  getSingleOfferedCourseFromDB,
  updateOfferedCourseInotDB,
};
