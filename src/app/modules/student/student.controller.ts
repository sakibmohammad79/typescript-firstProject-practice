import { Request, Response } from 'express';
import { studentServices } from './student.server';

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

export const studentController = {
  createStudent,
};
