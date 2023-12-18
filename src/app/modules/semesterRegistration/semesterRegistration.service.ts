/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import { appError } from '../../errors/appError';
import academicSemesterModel from '../academicSemester/semester.model';
import { TSemesterRegistration } from './semesterRegistration.interface';
import { SemesterRegistration } from './semesterRegistration.model';
import queryBuilder from '../../builder/queryBuilder';
import { registrationStatus } from './semesterRegistration.constant';
import { OfferedCourse } from '../offeredCourse/offeredCourse.model';
import mongoose from 'mongoose';

const createSemesterRegistrationIntoDB = async (
  payload: TSemesterRegistration
) => {
  //check if there any registered semester status is: 'UPCOMIN' or 'ONGOING'
  const isThereAnyUpcomingOROngoingSemester =
    await SemesterRegistration.findOne({
      $or: [
        { status: registrationStatus.UPCOMING },
        { status: registrationStatus.ONGOING },
      ],
    });
  if (isThereAnyUpcomingOROngoingSemester) {
    throw new appError(
      httpStatus.BAD_REQUEST,
      `There is already a ${isThereAnyUpcomingOROngoingSemester.status} registered semester!`
    );
  }
  const academicSemester = payload?.academicSemester;
  //check if academic semester exist
  const isAcademicSemesterExists = await academicSemesterModel.findById(
    academicSemester
  );
  if (!isAcademicSemesterExists) {
    throw new appError(
      httpStatus.NOT_FOUND,
      'This Academic Semester Not Found!'
    );
  }
  //check if semester registration already registered
  const isSemesterRegistrationExists = await SemesterRegistration.findOne({
    academicSemester,
  });
  if (isSemesterRegistrationExists) {
    throw new appError(
      httpStatus.CONFLICT,
      'This Semester already registered!'
    );
  }
  const result = await SemesterRegistration.create(payload);
  return result;
};

const getAllSemesterRegistrationFromDB = async (
  query: Record<string, unknown>
) => {
  const semesterRegistrationQuery = new queryBuilder(
    SemesterRegistration.find().populate('academicSemester'),
    query
  )
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await semesterRegistrationQuery.modelQuery;
  return result;
};

const getSingleSemesterRegistrationFromDB = async (id: string) => {
  const result = await SemesterRegistration.findById(id);
  return result;
};

const updateSemesterRegistrationInotDB = async (
  id: string,
  payload: Partial<TSemesterRegistration>
) => {
  //check if the requested registered semester is exists
  const isRequestedSmesterRegistrationExists =
    await SemesterRegistration.findById(id);
  if (!isRequestedSmesterRegistrationExists) {
    throw new appError(
      httpStatus.BAD_REQUEST,
      'The requested smester not found!'
    );
  }
  //check if the requested semester registration status 'Ended', will no updated anything.
  const currentSemesterStatus = isRequestedSmesterRegistrationExists.status;
  const requestedSemesterStatus = payload?.status;
  if (currentSemesterStatus === registrationStatus.ENDED) {
    throw new appError(
      httpStatus.BAD_REQUEST,
      `This semester is already ${currentSemesterStatus}`
    );
  }

  if (
    currentSemesterStatus === registrationStatus.UPCOMING &&
    requestedSemesterStatus === registrationStatus.ENDED
  ) {
    throw new appError(
      httpStatus.BAD_REQUEST,
      `You can not directly change status from  ${currentSemesterStatus} to ${requestedSemesterStatus}`
    );
  }

  if (
    currentSemesterStatus === registrationStatus.ONGOING &&
    requestedSemesterStatus === registrationStatus.UPCOMING
  ) {
    throw new appError(
      httpStatus.BAD_REQUEST,
      `You can not directly change status from  ${currentSemesterStatus} to ${requestedSemesterStatus}`
    );
  }

  const result = await SemesterRegistration.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deleteSemesterRegistrationFromDB = async (id: string) => {
  /** 
  * Step1: Delete associated offered courses.
  * Step2: Delete semester registraton when the status is 
  'UPCOMING'.
  **/

  // checking if the semester registration is exist
  const isSemesterRegistrationExists = await SemesterRegistration.findById(id);

  if (!isSemesterRegistrationExists) {
    throw new appError(
      httpStatus.NOT_FOUND,
      'This registered semester is not found !'
    );
  }

  // checking if the status is still "UPCOMING"
  const semesterRegistrationStatus = isSemesterRegistrationExists.status;

  if (semesterRegistrationStatus !== 'UPCOMING') {
    throw new appError(
      httpStatus.BAD_REQUEST,
      `You can not update as the registered semester is ${semesterRegistrationStatus}`
    );
  }

  const session = await mongoose.startSession();

  //deleting associated offered courses

  try {
    session.startTransaction();

    const deletedOfferedCourse = await OfferedCourse.deleteMany(
      {
        semesterRegistration: id,
      },
      {
        session,
      }
    );

    if (!deletedOfferedCourse) {
      throw new appError(
        httpStatus.BAD_REQUEST,
        'Failed to delete semester registration !'
      );
    }

    const deletedSemisterRegistration =
      await SemesterRegistration.findByIdAndDelete(id, {
        session,
        new: true,
      });

    if (!deletedSemisterRegistration) {
      throw new appError(
        httpStatus.BAD_REQUEST,
        'Failed to delete semester registration !'
      );
    }

    await session.commitTransaction();
    await session.endSession();

    return null;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

export const SemesterRegistrationServices = {
  createSemesterRegistrationIntoDB,
  getAllSemesterRegistrationFromDB,
  getSingleSemesterRegistrationFromDB,
  updateSemesterRegistrationInotDB,
  deleteSemesterRegistrationFromDB,
};
