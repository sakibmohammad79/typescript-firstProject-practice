import express from 'express';
import { studentController } from './student.controller';
import validateRequest from '../../middlewars/validateRequest';
import { StudentValidations } from './student.validationZod';
import auth from '../../middlewars/auth';

const router = express.Router();
router.get('/', studentController.getAllStudent);

router.get(
  '/:id',
  auth('admin', 'faculty'),
  studentController.getSingleStudent
);

router.patch(
  '/:id',
  validateRequest(StudentValidations.updateStudentValidationSchema),
  studentController.updateStudent
);

router.delete('/:id', studentController.deleteStudent);

export const StudentRoutes = router;
