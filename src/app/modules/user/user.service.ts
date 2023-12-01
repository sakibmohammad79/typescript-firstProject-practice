import { TStudent } from '../student/student.interface';
import { TUser } from './user.interface';
import { User } from './user.schema.model';
import config from '../../config';
import Student from '../student/student.schema.model';
import academicSemesterModel from '../academicSemester/semester.model';
import { generatedStudentId } from './user.utils';

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

  if (!admissionSemester) {
    throw new Error('Admission Semester not found');
  }

  //set  generated id
  userData.id = await generatedStudentId(admissionSemester);

  // create a user
  const newUser = await User.create(userData);

  //create a student
  if (Object.keys(newUser).length) {
    // set id , _id as user
    payload.id = newUser.id;
    payload.user = newUser._id; //reference _id

    const newStudent = await Student.create(payload);
    return newStudent;
  }
};

export const UserServices = {
  createStudneIntoDB,
};
