import express from 'express';

import validateRequest from '../../middlewars/validateRequest';
import { AcademicFacultyValidationSchema } from './faculty.validation';
import { AcademicFacultyControllers } from './faculty.controller';

const router = express.Router();

router.post(
  '/create-academic-faculty',
  validateRequest(
    AcademicFacultyValidationSchema.createAcademicFacultyValidationSchema
  ),
  AcademicFacultyControllers.createAcademicFaculty
);

router.get('/', AcademicFacultyControllers.getAllAcademicFaculies);

router.patch(
  '/:facultyId',
  validateRequest(
    AcademicFacultyValidationSchema.updateAcademicFacultyValidationSchema
  ),
  AcademicFacultyControllers.updateAcademicFaculty
);

router.get('/:facultyId', AcademicFacultyControllers.getSingleAcademicfaculty);

export const AcademicFacultyRoutes = router;
