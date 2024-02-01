import express from 'express';
import { academicSemesterControllers } from './semester.controller';
import validateRequest from '../../middlewars/validateRequest';
import { academicSemesterValidation } from './semester.validation';
import auth from '../../middlewars/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.post(
  '/create-academic-semester',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(
    academicSemesterValidation.createAcademicSemesterValidationSchema
  ),
  academicSemesterControllers.createAcademicSemester
);

router.get(
  '/',
  auth(
    USER_ROLE.superAdmin,
    USER_ROLE.admin,
    USER_ROLE.faculty,
    USER_ROLE.student
  ),
  academicSemesterControllers.getAllAcademicSemester
);

router.patch(
  '/:semesterId',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(
    academicSemesterValidation.updateAcademicSemesterValidationSchema
  ),
  academicSemesterControllers.updateAcademicSemester
);

router.get(
  '/:semesterId',
  auth(
    USER_ROLE.superAdmin,
    USER_ROLE.admin,
    USER_ROLE.faculty,
    USER_ROLE.student
  ),
  academicSemesterControllers.getSingleAcademicSemester
);

export const AcademicSemestersRoutes = router;
