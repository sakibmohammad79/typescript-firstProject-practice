/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { TStudent } from '../student/student.interface';
import { TUser } from './user.interface';
import { User } from './user.schema.model';
import config from '../../config';
import Student from '../student/student.schema.model';
import academicSemesterModel from '../academicSemester/semester.model';
import {
  generateAdminId,
  generateFacultyId,
  generatedStudentId,
} from './user.utils';
import mongoose from 'mongoose';
import { appError } from '../../errors/appError';
import httpStatus from 'http-status';
import { Admin } from '../admin/admin.model';
import { TFaculty } from '../faculty/faculty.interface';
import { Faculty } from '../faculty/faculty.model';
import { AcademicDepartment } from '../academicDepartment/department.model';

import { sendImageToCloudinary } from '../../utils/sendImageToCloudinay';

const createStudneIntoDB = async (
  file: any,
  password: string,
  payload: TStudent
) => {
  // create a user object
  const userData: Partial<TUser> = {};

  //if password is not given , use deafult password
  userData.password = password || (config.default_password as string);

  //set student role
  userData.role = 'student';
  //set student email
  userData.email = payload.email;

  // find academic semester info
  const admissionSemester = await academicSemesterModel.findById(
    payload.admissionSemester
  );

  if (!admissionSemester) {
    throw new Error('Admission Semester not found');
  }

  //find academic depertment
  const academicDepartment = await AcademicDepartment.findById(
    payload.academicDepartment
  );

  if (!academicDepartment) {
    throw new appError(httpStatus.NOT_FOUND, 'Academic Department not found!');
  }

  payload.academicFaculty = academicDepartment.academicFaculty;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    //set  generated id
    userData.id = await generatedStudentId(admissionSemester);

    if (file) {
      //imageName set
      const imageName = `${payload?.name?.firstName}${userData?.id}`;
      const path = file?.path;

      const { secure_url } = await sendImageToCloudinary(imageName, path);
      payload.profileImg = secure_url as string;
    }

    // create a user (transaction 1) array
    const newUser = await User.create([userData], { session });

    //create a student
    if (!newUser.length) {
      throw new appError(httpStatus.BAD_REQUEST, 'Faild to create User.');
    }
    // set id , _id as user
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id; //reference _id
    //set profile image

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
    throw new appError(
      httpStatus.BAD_REQUEST,
      'failed to create student and user!'
    );
  }
};

const createFacultyIntoDB = async (
  file: any,
  password: string,
  payload: TFaculty
) => {
  // create a user object
  const userData: Partial<TUser> = {};

  //if password is not given , use deafult password
  userData.password = password || (config.default_password as string);

  //set faculty role
  userData.role = 'faculty';
  //set faculty email
  userData.email = payload.email;

  // find academic department info
  const academicDepartment = await AcademicDepartment.findById(
    payload.academicDepartment
  );

  if (!academicDepartment) {
    throw new appError(400, 'Academic department not found');
  }

  payload.academicFaculty = academicDepartment.academicFaculty;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    //set  generated id
    userData.id = await generateFacultyId();

    if (file) {
      //imageName set
      const imageName = `${payload?.name?.firstName}${userData?.id}`;
      const path = file?.path;

      const { secure_url } = await sendImageToCloudinary(imageName, path);
      //set profile Image
      payload.profileImg = secure_url as string;
    }

    // create a user (transaction-1)
    const newUser = await User.create([userData], { session }); // array

    //create a faculty
    if (!newUser.length) {
      throw new appError(httpStatus.BAD_REQUEST, 'Failed to create user');
    }
    // set id , _id as user
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id; //reference _id

    // create a faculty (transaction-2)

    const newFaculty = await Faculty.create([payload], { session });

    if (!newFaculty.length) {
      throw new appError(httpStatus.BAD_REQUEST, 'Failed to create faculty');
    }

    await session.commitTransaction();
    await session.endSession();

    return newFaculty;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

const createAdminIntoDB = async (
  file: any,
  password: string,
  payload: TFaculty
) => {
  // create a user object
  const userData: Partial<TUser> = {};

  //if password is not given , use deafult password
  userData.password = password || (config.default_password as string);

  //set student role
  userData.role = 'admin';
  //set admin email
  userData.email = payload.email;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    //set  generated id
    userData.id = await generateAdminId();

    if (file) {
      //imageName set
      const imageName = `${payload?.name?.firstName}${userData?.id}`;
      const path = file?.path;

      const { secure_url } = await sendImageToCloudinary(imageName, path);
      //set profile image
      payload.profileImg = secure_url as string;
    }

    // create a user (transaction-1)
    const newUser = await User.create([userData], { session });

    //create a admin
    if (!newUser.length) {
      throw new appError(httpStatus.BAD_REQUEST, 'Failed to create admin');
    }
    // set id , _id as user
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id; //reference _id

    // create a admin (transaction-2)
    const newAdmin = await Admin.create([payload], { session });

    if (!newAdmin.length) {
      throw new appError(httpStatus.BAD_REQUEST, 'Failed to create admin');
    }

    await session.commitTransaction();
    await session.endSession();

    return newAdmin;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

const getMe = async (userId: string, role: string) => {
  let data = null;
  if (role === 'student') {
    data = await Student.findOne({ id: userId }).populate('user');
  }
  if (role === 'faculty') {
    data = await Faculty.findOne({ id: userId }).populate('user');
  }
  if (role === 'admin') {
    data = await Admin.findOne({ id: userId }).populate('user');
  }

  return data;
};
const changeStatus = async (id: string, payload: { status: string }) => {
  const result = await User.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
};

export const UserServices = {
  createStudneIntoDB,
  createFacultyIntoDB,
  createAdminIntoDB,
  getMe,
  changeStatus,
};
