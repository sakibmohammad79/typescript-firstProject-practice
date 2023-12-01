//auto generated student id

import { TAcademicSemester } from '../academicSemester/semester.interface';
import { User } from './user.schema.model';

const findLastStudentId = async () => {
  const lastStudent = await User.findOne(
    {
      role: 'student',
    },
    {
      id: 1,
      _id: 0,
    }
  )
    .sort({
      createdAt: -1,
    })
    .lean();

  //2030 01 0001
  return lastStudent?.id ? lastStudent.id.substring(6) : undefined;
};

//year, semester, and 4 digit code
export const generatedStudentId = async (payload: TAcademicSemester) => {
  // first time 0000
  //0001  => 1
  const currentId = (await findLastStudentId()) || (0).toString();
  //console.log(currentId);

  let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');

  incrementId = `${payload.year}${payload.code}${incrementId}`;
  //console.log(incrementId);

  return incrementId;
};
