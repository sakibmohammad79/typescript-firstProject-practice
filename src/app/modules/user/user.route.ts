import express from 'express';
import { UserController } from './user.controller';

import { StudentValidations } from '../student/student.validationZod';
import validateRequest from '../../middlewars/validateRequest';
import { createFacultyValidationSchema } from '../faculty/faculty.validation';
import { createAdminValidationSchema } from '../admin/admin.validation';

const router = express.Router();

router.post(
  '/create-student',
  validateRequest(StudentValidations.createStudentValidationSchema),
  UserController.createStudent
);

router.post(
  '/create-faculty',
  validateRequest(createFacultyValidationSchema),
  UserController.createFaculty
);

router.post(
  '/create-admin',
  validateRequest(createAdminValidationSchema),
  UserController.createAdmin
);

export const UserRoutes = router;
