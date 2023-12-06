import express from 'express';
import { studentController } from './student.controller';
import validateRequest from '../../middlewars/validateRequest';
import { StudentValidations } from './student.validationZod';

const router = express.Router();
router.get('/', studentController.getAllStudent);

router.get('/:studentId', studentController.getSingleStudent);

router.patch(
  '/:studentId',
  validateRequest(StudentValidations.updateStudentValidationSchema),
  studentController.updateStudent
);

router.delete('/:studentId', studentController.deleteStudent);

export const StudentRoutes = router;
