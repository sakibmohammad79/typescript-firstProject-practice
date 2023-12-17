import httpStatus from 'http-status';
import { appError } from '../../errors/appError';
import { SemesterRegistration } from '../semesterRegistration/semesterRegistration.model';
import { TOfferCourse } from './offeredCourse.interface';
import { OfferedCourse } from './offeredCourse.model';
import { AcademicFaculty } from '../academicFaculty/faculty.model';
import { AcademicDepartment } from '../academicDepartment/department.model';
import { Course } from '../course/course.model';
import { Faculty } from '../faculty/faculty.model';
import { hasTimeConflict } from './offeredCourse.utils';
import { TSemesterRegistration } from '../semesterRegistration/semesterRegistration.interface';

const createOfferedCourseIntoDB = async (payload: TOfferCourse) => {
  const {
    semesterRegistration,
    academicFaculty,
    academicDepartment,
    course,
    faculty,
    section,
    days,
    startTime,
    endTime,
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

  //if this department is belong to the faculty
  const isDepartemntBelongToFaculty = await AcademicDepartment.findOne({
    academicFaculty,
    _id: academicDepartment,
  });
  if (!isDepartemntBelongToFaculty) {
    throw new appError(
      httpStatus.BAD_REQUEST,
      `This ${isAcademicDepartmentExists.name} is not belong to the ${isAcademicFacultyExists.name}`
    );
  }

  //check if the same offered course in same section in same registered semester
  const isSameOfferedCourseExistsWithSameRegisteredSemesterWithSameSection =
    await OfferedCourse.findOne({
      semesterRegistration,
      section,
      course,
    });

  if (isSameOfferedCourseExistsWithSameRegisteredSemesterWithSameSection) {
    throw new appError(
      httpStatus.BAD_REQUEST,
      'offered course with same section is already exists'
    );
  }

  //get Schedules of the faculties
  const assignSchedule = await OfferedCourse.find({
    semesterRegistration,
    faculty,
    days: { $in: days },
  }).select('days startTime endTime');

  const newSchedule = {
    days,
    startTime,
    endTime,
  };

  if (hasTimeConflict(assignSchedule, newSchedule)) {
    throw new appError(
      httpStatus.CONFLICT,
      'This faculty is not available at that time! choose another time or day.'
    );
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
  payload: Pick<TOfferCourse, 'faculty' | 'days' | 'startTime' | 'endTime'>
) => {
  const { faculty, days, startTime, endTime } = payload;

  const isOfferedCourseExists = await OfferedCourse.findById(id);
  if (!isOfferedCourseExists) {
    throw new appError(httpStatus.NOT_FOUND, 'The offered course not found!');
  }

  const isFacultyExists = await Faculty.findById(faculty);

  if (!isFacultyExists) {
    throw new appError(httpStatus.NOT_FOUND, 'Faculty not found!');
  }

  const semesterRegistration = isOfferedCourseExists.semesterRegistration;

  const semesterRegistrationStatus = await SemesterRegistration.findById(
    semesterRegistration
  );
  if (semesterRegistrationStatus?.status !== 'UPCOMING') {
    throw new appError(
      httpStatus.BAD_REQUEST,
      `You can not update this offered course, as it is ${semesterRegistrationStatus?.status}!`
    );
  }

  //get Schedules of the faculties
  const assignSchedule = await OfferedCourse.find({
    semesterRegistration,
    faculty,
    days: { $in: days },
  }).select('days startTime endTime');

  const newSchedule = {
    days,
    startTime,
    endTime,
  };

  if (hasTimeConflict(assignSchedule, newSchedule)) {
    throw new appError(
      httpStatus.CONFLICT,
      'This faculty is not available at that time! choose another time or day.'
    );
  }

  const result = await OfferedCourse.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
};

export const offeredCourseServices = {
  createOfferedCourseIntoDB,
  getAllOfferedCourseFromDB,
  getSingleOfferedCourseFromDB,
  updateOfferedCourseInotDB,
};
