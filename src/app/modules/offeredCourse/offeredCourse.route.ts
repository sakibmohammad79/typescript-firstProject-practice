import express from 'express';
import validateRequest from '../../middlewars/validateRequest';
import { offeredCourseValidation } from './offeredCourse.validation';
import { offeredCourseController } from './offeredCourse.controller';
import auth from '../../middlewars/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.post(
  '/create-offered-course',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(offeredCourseValidation.createOfferedCourseValidationSchema),
  offeredCourseController.createOfferedCourse
);

router.get(
  '/',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.faculty),
  offeredCourseController.getAllOfferedCourse
);

router.get(
  '/my-offered-courses',
  auth(USER_ROLE.student),
  offeredCourseController.getMyOfferedCourse
);

router.get(
  '/:id',
  auth(
    USER_ROLE.superAdmin,
    USER_ROLE.admin,
    USER_ROLE.faculty,
    USER_ROLE.student
  ),
  offeredCourseController.getSingleOfferedCourse
);

router.patch(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(offeredCourseValidation.updatedOfferedCourseValidationSchema),
  offeredCourseController.updateOfferedCourse
);

router.delete(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  offeredCourseController.deleteOfferedCourse
);

export const OfferedCourseRoutes = router;
