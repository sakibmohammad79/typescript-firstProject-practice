import express from 'express';
import { UserController } from './user.controller';

import { StudentValidations } from '../student/student.validationZod';
import validateRequest from '../../middlewars/validateRequest';
import { createFacultyValidationSchema } from '../faculty/faculty.validation';
import { createAdminValidationSchema } from '../admin/admin.validation';
import auth from '../../middlewars/auth';
import { USER_ROLE } from './user.constant';
import { userValidations } from './user.validationZod';

const router = express.Router();

router.post(
  '/create-student',
  auth(USER_ROLE.admin),
  validateRequest(StudentValidations.createStudentValidationSchema),
  UserController.createStudent
);

router.post(
  '/create-faculty',
  auth(USER_ROLE.admin),
  validateRequest(createFacultyValidationSchema),
  UserController.createFaculty
);

router.post(
  '/create-admin',
  // auth(USER_ROLE.admin),
  validateRequest(createAdminValidationSchema),
  UserController.createAdmin
);

router.get('/me', auth('admin', 'faculty', 'student'), UserController.getMe);

router.post(
  '/change-status/:id',
  auth(USER_ROLE.admin),
  validateRequest(userValidations.changeStatusValidationSchema),
  UserController.changeStatus
);
export const UserRoutes = router;
