import express from 'express';
import { studentController } from './student.controller';
import validateRequest from '../../middlewars/validateRequest';
import { StudentValidations } from './student.validationZod';
import auth from '../../middlewars/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();
router.get(
  '/',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  studentController.getAllStudent
);

router.get(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.faculty),
  studentController.getSingleStudent
);

router.patch(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(StudentValidations.updateStudentValidationSchema),
  studentController.updateStudent
);

router.delete(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  studentController.deleteStudent
);

export const StudentRoutes = router;
