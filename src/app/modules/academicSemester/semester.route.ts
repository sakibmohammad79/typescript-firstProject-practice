import express from 'express';
import { academicSemesterControllers } from './semester.controller';
import validateRequest from '../../middlewars/validateRequest';
import { academicSemesterValidation } from './semester.validation';
import auth from '../../middlewars/auth';

const router = express.Router();

router.post(
  '/create-academic-semester',
  validateRequest(
    academicSemesterValidation.createAcademicSemesterValidationSchema
  ),
  academicSemesterControllers.createAcademicSemester
);

router.get(
  '/',
  auth('admin'),
  academicSemesterControllers.getAllAcademicSemester
);

router.patch(
  '/:semesterId',
  validateRequest(
    academicSemesterValidation.updateAcademicSemesterValidationSchema
  ),
  academicSemesterControllers.updateAcademicSemester
);

router.get(
  '/:semesterId',
  academicSemesterControllers.getSingleAcademicSemester
);

export const AcademicSemestersRoutes = router;
