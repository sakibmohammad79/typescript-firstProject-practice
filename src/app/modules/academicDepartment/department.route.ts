import express from 'express';

import validateRequest from '../../middlewars/validateRequest';
import { AcademicDepartmentValidation } from './department.validation';
import { AcademicDepartmentControllers } from './department.controller';
import auth from '../../middlewars/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.post(
  '/create-academic-department',
  auth(USER_ROLE.superAdmin),
  validateRequest(
    AcademicDepartmentValidation.createAcademicDepartmentValidationSchema
  ),
  AcademicDepartmentControllers.createAcademicDepartment
);

router.get('/', AcademicDepartmentControllers.getAllAcademicDepartment);

router.patch(
  '/:departmentId',
  validateRequest(
    AcademicDepartmentValidation.updateAcademicDepartmentValidationSchema
  ),
  AcademicDepartmentControllers.updateAcademicDepartment
);

router.get(
  '/:departmentId',
  AcademicDepartmentControllers.getSingleAcademicDepartment
);

export const AcademicDepartmentRoutes = router;
