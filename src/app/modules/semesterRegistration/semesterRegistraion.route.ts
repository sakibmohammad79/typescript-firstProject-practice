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

router.get('/', semesterRegistraionController.getAllSemesterRegistration);

router.get('/:id', semesterRegistraionController.getSingleSemesterRegistration);

router.patch(
  '/:id',
  validateRequest(
    semesterRegistrationValidations.updateSemesterRegistraionValidatioSchema
  ),
  semesterRegistraionController.updateSemesterRegistraion
);

export const SemesterRegistrationRoutes = router;
