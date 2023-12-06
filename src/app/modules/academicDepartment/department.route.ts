import express from 'express';

import validateRequest from '../../middlewars/validateRequest';
import { AcademicDepartmentValidation } from './department.validation';
import { AcademicDepartmentControllers } from './department.controller';

const router = express.Router();

router.post(
  '/create-academic-department',
  // validateRequest(
  //   AcademicDepartmentValidation.createAcademicDepartmentValidationSchema
  // ),
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
