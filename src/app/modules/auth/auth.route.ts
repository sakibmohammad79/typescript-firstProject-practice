import express from 'express';
import validateRequest from '../../middlewars/validateRequest';
import { authValidation } from './auth.validation';
import { authController } from './auth.controller';

const router = express.Router();

router.post(
  '/login',
  validateRequest(authValidation.loginValidationSchema),
  authController.loginUser
);

export const AuthRoutes = router;
