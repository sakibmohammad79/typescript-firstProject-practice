import express from 'express';
import validateRequest from '../../middlewars/validateRequest';
import { semesterRegistrationValidations } from './semesterRegistraionValidation';
import { semesterRegistraionController } from './semesterRegistration.controller';
import { USER_ROLE } from '../user/user.constant';
import auth from '../../middlewars/auth';
const router = express.Router();

router.post(
  '/create-semester-registration',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(
    semesterRegistrationValidations.createSemesterRegistraionValidatioSchema
  ),
  semesterRegistraionController.createSemesterRegistration
);

router.get(
  '/',
  auth(
    USER_ROLE.superAdmin,
    USER_ROLE.admin,
    USER_ROLE.faculty,
    USER_ROLE.student
  ),
  semesterRegistraionController.getAllSemesterRegistration
);

router.get(
  '/:id',
  auth(
    USER_ROLE.superAdmin,
    USER_ROLE.admin,
    USER_ROLE.faculty,
    USER_ROLE.student
  ),
  semesterRegistraionController.getSingleSemesterRegistration
);

router.patch(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(
    semesterRegistrationValidations.updateSemesterRegistraionValidatioSchema
  ),
  semesterRegistraionController.updateSemesterRegistraion
);

router.delete(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  semesterRegistraionController.deleteSemesterRegistration
);

export const SemesterRegistrationRoutes = router;
