import { Request, Response } from 'express';
import { studentServices } from './student.service';
import StudentValidationSchema from './student.validationZod';
//import studentValidationSchema from './student.validationJoi';

const createStudent = async (req: Request, res: Response) => {
  try {
    //creating schema validation using zod;

    const { student: studentData } = req.body;
    //data validation using zod
    const zodValidationData = StudentValidationSchema.parse(studentData);

    //using joi
    //const { error, value } = studentValidationSchema.validate(studentData);
    // console.log({ error }, { value });
    // if (error) {
    //   res.status(200).json({
    //     success: false,
    //     message: 'something went wrong(joi)',
    //     error: error.details,
    //   });
    // }

    const result = await studentServices.createStudneIntoDB(zodValidationData);

    res.status(200).json({
      success: true,
      message: 'student create successfylly!',
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Something went wrong',
      error: error,
    });
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
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Something went wrong',
      error: error,
    });
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
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Something went wrong',
      error: error,
    });
  }
};

const deleteStudent = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const result = await studentServices.deleteStudentFromDB(studentId);

    res.status(200).json({
      success: true,
      message: 'student delete successfully!',
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Something went wrong',
      error: error,
    });
  }
};

export const studentController = {
  createStudent,
  getAllStudent,
  getSingleStudent,
  deleteStudent,
};
