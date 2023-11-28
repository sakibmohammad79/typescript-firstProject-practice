import { TStudent } from '../student/student.interface';
import { TUser } from './user.interface';
import { User } from './user.schema.model';
import config from '../../config';
import Student from '../student/student.schema.model';

const createStudneIntoDB = async (password: string, studentData: TStudent) => {
  //create a user object
  const userData: Partial<TUser> = {};

  //if password is not given, use default password
  userData.password = password || (config.bycrypt_salt_rounds as string);

  //set role
  userData.role = 'student';
  //set manually generated id
  userData.id = '2030100001';
  //create a user
  const newUser = await User.create(userData);

  //create a student
  if (Object.keys(newUser).length) {
    studentData.id = newUser.id;
    studentData.user = newUser._id;

    //create new student
    const newStudent = await Student.create(studentData);
    return newStudent;
  }
};
export const UserServices = {
  createStudneIntoDB,
};
