/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import { appError } from '../../errors/appError';
import { OfferedCourse } from '../offeredCourse/offeredCourse.model';
import { TEnrolledCourse } from './enrolledCourse.interface';
import { EnrolledCourse } from './enrolledCourse.model';
import Student from '../student/student.schema.model';
import mongoose from 'mongoose';
import { SemesterRegistration } from '../semesterRegistration/semesterRegistration.model';
import { Course } from '../course/course.model';
import { Faculty } from '../faculty/faculty.model';

const createEnrolledCourseIntoDB = async (
  userId: string,
  payload: TEnrolledCourse
) => {
  const { offeredCourse } = payload;
  const isOfferedCourseExists = await OfferedCourse.findById(offeredCourse);
  if (!isOfferedCourseExists) {
    throw new appError(httpStatus.NOT_FOUND, 'Offered Course not found!');
  }

  const course = await Course.findById(isOfferedCourseExists.course);
  const currentCourseCredit = course?.credits;

  if (isOfferedCourseExists.maxCapacity <= 0) {
    throw new appError(httpStatus.BAD_REQUEST, 'Room is full!');
  }

  //check if student already enrolled course
  const student = await Student.findOne({ id: userId }, { _id: 1 });
  if (!student) {
    throw new appError(httpStatus.NOT_FOUND, 'Student not found!');
  }
  const isStudentAlreadyEnrolled = await EnrolledCourse.findOne({
    semesterRegistration: isOfferedCourseExists?.semesterRegistration,
    offeredCourse,
    student: student?._id,
  });
  if (isStudentAlreadyEnrolled) {
    throw new appError(httpStatus.CONFLICT, 'This student already enrolled!');
  }

  //check total creadt exceeds max creadits
  const semesterRegistration = await SemesterRegistration.findById(
    isOfferedCourseExists.semesterRegistration
  ).select('maxCredit');

  const maxCredit = semesterRegistration?.maxCredit;

  //check if maxCredit < total enrolled credit + new enrolled course credit
  const enrolledCourses = await EnrolledCourse.aggregate([
    {
      $match: {
        semesterRegistration: isOfferedCourseExists.semesterRegistration,
        student: student._id,
      },
    },
    {
      $lookup: {
        from: 'courses',
        localField: 'course',
        foreignField: '_id',
        as: 'enrolledCourseData',
      },
    },
    {
      $unwind: '$enrolledCourseData',
    },
    {
      $group: {
        _id: null,
        totalEnrolledCredits: { $sum: '$enrolledCourseData.credits' },
      },
    },
    {
      $project: { _id: 0, totalEnrolledCredits: 1 },
    },
  ]);

  //total credits
  const totalCredits =
    enrolledCourses.length > 0 ? enrolledCourses[0].totalEnrolledCredits : 0;

  if (
    totalCredits &&
    maxCredit &&
    totalCredits + currentCourseCredit > maxCredit
  ) {
    throw new appError(
      httpStatus.BAD_REQUEST,
      'You have exceeded number of course credit!'
    );
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const result = await EnrolledCourse.create(
      [
        {
          semesterRegistration: isOfferedCourseExists.semesterRegistration,
          academicSemester: isOfferedCourseExists.academicSemester,
          academicFaculty: isOfferedCourseExists.academicFaculty,
          academicDepartment: isOfferedCourseExists.academicDepartment,
          offeredCourse: offeredCourse,
          course: isOfferedCourseExists.course,
          student: student._id,
          faculty: isOfferedCourseExists.faculty,
          isEnrolled: true,
        },
      ],
      { session }
    );

    if (!result) {
      throw new appError(httpStatus.BAD_REQUEST, 'Failed to enrolled course!');
    }

    const maxCapacity = isOfferedCourseExists.maxCapacity;
    await OfferedCourse.findByIdAndUpdate(offeredCourse, {
      maxCapacity: maxCapacity - 1,
    });

    await session.commitTransaction();
    await session.endSession();

    return result;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

const updateEnrolledCourseMarksIntoDb = async (
  facultyId: string,
  payload: Partial<TEnrolledCourse>
) => {
  const { semesterRegistration, offeredCourse, student, courseMarks } = payload;

  const isSemesterRegistrationExists = await SemesterRegistration.findById(
    semesterRegistration
  );
  if (!isSemesterRegistrationExists) {
    throw new appError(
      httpStatus.NOT_FOUND,
      'Semester Registration not found!'
    );
  }

  const isOfferedCourseExists = await OfferedCourse.findById(offeredCourse);
  if (!isOfferedCourseExists) {
    throw new appError(httpStatus.NOT_FOUND, 'Offered Course not found!');
  }

  const isStudentExists = await Student.findById(student);
  if (!isStudentExists) {
    throw new appError(httpStatus.NOT_FOUND, 'This student not found!');
  }

  const faculty = await Faculty.findOne({ id: facultyId }, { _id: 1 });
  if (!faculty) {
    throw new appError(httpStatus.NOT_FOUND, 'This faculty not found!');
  }
  const isCourseBeglongToFaculty = await EnrolledCourse.findOne({
    semesterRegistration,
    offeredCourse,
    student,
    faculty: faculty._id,
  });
  if (!isCourseBeglongToFaculty) {
    throw new appError(
      httpStatus.FORBIDDEN,
      'You are forbidden, marke not update!'
    );
  }

  const modifiedData: Record<string, number> = {
    ...courseMarks,
  };
  if (courseMarks && Object.keys(courseMarks).length) {
    for (const [key, value] of Object.entries(courseMarks)) {
      modifiedData[`courseMarks.${key}`] = value;
    }
  }

  const result = await EnrolledCourse.findByIdAndUpdate(
    isCourseBeglongToFaculty._id,
    modifiedData,
    { new: true }
  );

  return result;
};

export const EnrolledCourseServices = {
  createEnrolledCourseIntoDB,
  updateEnrolledCourseMarksIntoDb,
};
