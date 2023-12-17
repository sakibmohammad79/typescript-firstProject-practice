import express from 'express';
import validateRequest from '../../middlewars/validateRequest';
import { offeredCourseValidation } from './offeredCourse.validation';
import { offeredCourseController } from './offeredCourse.controller';

const router = express.Router();

router.post(
  '/create-offered-course',
  validateRequest(offeredCourseValidation.createOfferedCourseValidationSchema),
  offeredCourseController.createOfferedCourse
);

router.get('/', offeredCourseController.getAllOfferedCourse);

router.get('/:id', offeredCourseController.getSingleOfferedCourse);

router.patch(
  '/:id',
  validateRequest(offeredCourseValidation.updatedOfferedCourseValidationSchema),
  offeredCourseController.updateOfferedCourse
);

export const OfferedCourseRoutes = router;
