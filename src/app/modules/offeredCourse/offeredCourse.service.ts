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
import queryBuilder from '../../builder/queryBuilder';
import Student from '../student/student.schema.model';

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
  const offeredCourseQuery = new queryBuilder(OfferedCourse.find(), query)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await offeredCourseQuery.modelQuery;
  const meta = await offeredCourseQuery.countTotal();
  return {
    meta,
    result,
  };
};

const getMyOfferedCourseFromDB = async (userId: string) => {
  //find student
  const student = await Student.findOne({ id: userId });

  if (!student) {
    throw new appError(httpStatus.NOT_FOUND, 'Student not found!');
  }

  //find current ongoint semester
  const currentOngoingRegistrationSemester = await SemesterRegistration.findOne(
    {
      status: 'ONGOING',
    }
  );

  if (!currentOngoingRegistrationSemester) {
    throw new appError(
      httpStatus.NOT_FOUND,
      'There is no ongoing semester registration!'
    );
  }

  const result = await OfferedCourse.aggregate([
    {
      $match: {
        semesterRegistration: currentOngoingRegistrationSemester?._id,
        academicFaculty: student.academicFaculty,
        academicDepartment: student.academicDepartment,
      },
    },
    {
      $lookup: {
        from: 'courses',
        localField: 'course',
        foreignField: '_id',
        as: 'course',
      },
    },
    {
      $unwind: '$course',
    },
    {
      $lookup: {
        from: 'enrolledcourses',
        let: {
          currentOngoingRegistrationSemester:
            currentOngoingRegistrationSemester._id,
          currentStudent: student._id,
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $eq: [
                      '$semesterRegistration',
                      '$$currentOngoingRegistrationSemester',
                    ],
                  },
                  {
                    $eq: ['$student', '$$currentStudent'],
                  },
                  {
                    $eq: ['$isEnrolled', true],
                  },
                ],
              },
            },
          },
        ],
        as: 'enrolledCourses',
      },
    },
    // {
    //   $addFields: {
    //     $in: [
    //       '$course._id',
    //       {
    //         $map: {
    //           input: '',
    //         },
    //       },
    //     ],
    //   },
    // },
  ]);

  return result;
};

const getSingleOfferedCourseFromDB = async (id: string) => {
  const offeredCourse = await OfferedCourse.findById(id);
  if (!offeredCourse) {
    throw new appError(httpStatus.BAD_REQUEST, 'Offered course not found!');
  }
  return offeredCourse;
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

const deleteOfferedCourseFromDB = async (id: string) => {
  //check if offered course exists
  const isOfferedCourseExists = await OfferedCourse.findById(id);
  if (!isOfferedCourseExists) {
    throw new appError(httpStatus.NOT_FOUND, 'Offerd course not found!');
  }
  //check if requested offered course status is upcoming
  const semesterRegistration = isOfferedCourseExists.semesterRegistration;
  const semesterRegistrationStatus = await SemesterRegistration.findById(
    semesterRegistration
  );
  if (semesterRegistrationStatus?.status !== 'UPCOMING') {
    throw new appError(
      httpStatus.NOT_FOUND,
      `The offered course can not update! Because the semester ${semesterRegistrationStatus?.status}`
    );
  }
  const result = await OfferedCourse.findByIdAndDelete(id);
  return result;
};

export const offeredCourseServices = {
  createOfferedCourseIntoDB,
  getAllOfferedCourseFromDB,
  getMyOfferedCourseFromDB,
  getSingleOfferedCourseFromDB,
  updateOfferedCourseInotDB,
  deleteOfferedCourseFromDB,
};
