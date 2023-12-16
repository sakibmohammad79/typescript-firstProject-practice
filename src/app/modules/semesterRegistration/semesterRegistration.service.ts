import httpStatus from 'http-status';
import { appError } from '../../errors/appError';
import academicSemesterModel from '../academicSemester/semester.model';
import { TSemesterRegistration } from './semesterRegistration.interface';
import { SemesterRegistration } from './semesterRegistration.model';

const createSemesterRegistrationIntoDB = async (
  payload: TSemesterRegistration
) => {
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

const getAllSemesterRegistrationFromDB = async () => {};

const getSingleSemesterRegistrationFromDB = async () => {};

const updateSemesterRegistrationInotDB = async () => {};

export const SemesterRegistrationServices = {
  createSemesterRegistrationIntoDB,
  getAllSemesterRegistrationFromDB,
  getSingleSemesterRegistrationFromDB,
  updateSemesterRegistrationInotDB,
};
