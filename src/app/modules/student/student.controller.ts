import { Request, Response } from 'express';
import { studentServices } from './student.service';

const createStudent = async (req: Request, res: Response) => {
  try {
    const student = req.body.student;

    const result = await studentServices.createStudneIntoDB(student);

    res.status(200).json({
      success: true,
      message: 'student create successfylly!',
      data: result,
    });
  } catch (error) {
    console.log(error);
  }
};

const getAllStudent = async (req: Request, res: Response) => {
  try {
    const result = await studentServices.getAllStudentIntoDB();

    res.status(200).json({
      success: true,
      message: 'get all student successfully!',
      data: result,
    });
  } catch (err) {
    console.log(err);
  }
};

const getSingleStudent = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const result = await studentServices.getSingleStudentIntoDB(studentId);

    res.status(200).json({
      success: true,
      message: 'single get successfully!',
      data: result,
    });
  } catch (err) {
    console.log(err);
  }
};

export const studentController = {
  createStudent,
  getAllStudent,
  getSingleStudent,
};
