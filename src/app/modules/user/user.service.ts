import { TStudent } from '../student/student.interface';
import { TUser } from './user.interface';
import { User } from './user.schema.model';
import config from '../../config';
import Student from '../student/student.schema.model';
import academicSemesterModel from '../academicSemester/semester.model';
import { generatedStudentId } from './user.utils';
import mongoose from 'mongoose';
import { appError } from '../../errors/appError';
import httpStatus from 'http-status';

const createStudneIntoDB = async (password: string, payload: TStudent) => {
  // create a user object
  const userData: Partial<TUser> = {};

  //if password is not given , use deafult password
  userData.password = password || (config.default_password as string);

  //set student role
  userData.role = 'student';

  // find academic semester info
  const admissionSemester = await academicSemesterModel.findById(
    payload.admissionSemester
  );

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    if (!admissionSemester) {
      throw new Error('Admission Semester not found');
    }

    //set  generated id
    userData.id = await generatedStudentId(admissionSemester);

    // create a user (transaction 1) array
    const newUser = await User.create([userData], { session });

    //create a student
    if (!newUser.length) {
      throw new appError(httpStatus.BAD_REQUEST, 'Faild to create User.');
    }
    // set id , _id as user
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id; //reference _id
    //create a student transaction 2
    const newStudent = await Student.create([payload], { session });
    if (!newStudent.length) {
      throw new appError(httpStatus.BAD_REQUEST, 'Failed to create student.');
    }

    await session.commitTransaction();
    await session.endSession();

    return newStudent;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new appError(404, 'Failed to delete student.');
  }
};

export const UserServices = {
  createStudneIntoDB,
};
