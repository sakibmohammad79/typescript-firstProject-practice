import express from 'express';
import validateRequest from '../../middlewars/validateRequest';
import { semesterRegistrationValidations } from './semesterRegistraionValidation';
import { semesterRegistraionController } from './semesterRegistration.controller';
const router = express.Router();

router.post(
  '/create-semester-registration',
  validateRequest(
    semesterRegistrationValidations.createSemesterRegistraionValidatioSchema
  ),
  semesterRegistraionController.createSemesterRegistration
);

export const SemesterRegistrationRoutes = router;
