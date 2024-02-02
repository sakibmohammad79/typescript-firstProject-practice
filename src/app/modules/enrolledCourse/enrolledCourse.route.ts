import express from 'express';
import validateRequest from '../../middlewars/validateRequest';
import { EnrolledCourseValidations } from './enrolledCourse.validation';
import { EnrolledCourseController } from './enrolledCourse.controller';
import auth from '../../middlewars/auth';
import { USER_ROLE } from '../user/user.constant';
const router = express.Router();

router.post(
  '/create-enrolled-course',
  auth(USER_ROLE.student),
  validateRequest(
    EnrolledCourseValidations.createEnrolledCourseValidationZodSchema
  ),
  EnrolledCourseController.createEnrolledCourse
);

router.get(
  '/my-enrolled-courses',
  auth(USER_ROLE.student),
  EnrolledCourseController.getMyEnrolledCourses
);
router.patch(
  '/update-enrolled-course-marks',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.faculty),
  validateRequest(
    EnrolledCourseValidations.updateEnrolledCourseZodValidationSchema
  ),
  EnrolledCourseController.updateEnrolledCourseMarks
);

export const EnrolledCourseRoutes = router;
