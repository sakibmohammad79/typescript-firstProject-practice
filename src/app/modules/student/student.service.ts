import Student from './student.schema.model';
import { TStudent } from './student.interface';

const createStudneIntoDB = async (studentData: TStudent) => {
  //static method
  if (await Student.isUserExists(studentData.id)) {
    throw new Error('User already exists');
  }

  const result = await Student.create(studentData); //buildin static method(create)

  //   const student = new Student(studentData); //create a instance
  //   if (await student.isUserExists(studentData.id)) {
  //     throw new Error('user already exists');
  //   }
  //   const result = await student.save(); //build in instance method(provide moongose)
  return result;
};

const getAllStudentIntoDB = async () => {
  const result = await Student.find();
  return result;
};

const getSingleStudentIntoDB = async (id: string) => {
  //const result = await Student.findOne({ id });
  const result = await Student.aggregate([{ $match: { id: id } }]);
  return result;
};

const deleteStudentFromDB = async (id: string) => {
  const result = await Student.updateOne({ id }, { isDeleted: true });
  return result;
};

export const studentServices = {
  createStudneIntoDB,
  getAllStudentIntoDB,
  getSingleStudentIntoDB,
  deleteStudentFromDB,
};
