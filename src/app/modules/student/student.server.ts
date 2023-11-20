import studentModel from '../student.schema.model';
import { Student } from './student.interface';

const createStudneIntoDB = async (student: Student) => {
  const result = await studentModel.create(student);
  return result;
};

export const studentServices = {
  createStudneIntoDB,
};
