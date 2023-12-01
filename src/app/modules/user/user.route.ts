import express from 'express';
import { UserController } from './user.controller';

import { StudentValidations } from '../student/student.validationZod';
import validateRequest from '../../middlewars/validateRequest';

const router = express.Router();

router.post(
  '/create-student',
  validateRequest(StudentValidations.createStudentValidationSchema),
  UserController.createStudent
);

export const UserRoutes = router;
