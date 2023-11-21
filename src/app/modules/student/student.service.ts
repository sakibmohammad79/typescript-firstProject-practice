import studentModel from '../student.schema.model';
import { Student } from './student.interface';

const createStudneIntoDB = async (student: Student) => {
  const result = await studentModel.create(student);
  return result;
};

const getAllStudentIntoDB = async () => {
  const result = await studentModel.find();
  return result;
};

const getSingleStudentIntoDB = async (id: string) => {
  const result = await studentModel.findOne({ id });
  return result;
};

export const studentServices = {
  createStudneIntoDB,
  getAllStudentIntoDB,
  getSingleStudentIntoDB,
};
