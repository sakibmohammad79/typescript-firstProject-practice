import express from 'express';
import validateRequest from '../../middlewars/validateRequest';
import { authValidation } from './auth.validation';
import { authController } from './auth.controller';
import auth from '../../middlewars/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.post(
  '/login',
  validateRequest(authValidation.loginValidationSchema),
  authController.loginUser
);
router.post(
  '/change-password',
  auth(USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student),
  validateRequest(authValidation.changePasswordValidationSchema),
  authController.changePassword
);
router.post(
  '/refresh-token',
  validateRequest(authValidation.refreshTokenValidationSchema),
  authController.refreshToken
);

export const AuthRoutes = router;
