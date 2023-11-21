import Student from '../student.schema.model';
import { TStudent } from './student.interface';

const createStudneIntoDB = async (studentData: TStudent) => {
  //const result = await studentModel.create(student);//buildin static method(create)

  const student = new Student(studentData); //create a instance
  if (await student.isUserExists(studentData.id)) {
    throw Error('user already exists');
  }

  const result = await student.save(); //build in instance method(provide moongose)
  return result;
};

const getAllStudentIntoDB = async () => {
  const result = await Student.find();
  return result;
};

const getSingleStudentIntoDB = async (id: string) => {
  const result = await Student.findOne({ id });
  return result;
};

export const studentServices = {
  createStudneIntoDB,
  getAllStudentIntoDB,
  getSingleStudentIntoDB,
};
