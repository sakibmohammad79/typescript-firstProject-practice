import { z } from 'zod';
import { userStatus } from './user.constant';

const userValidationSchema = z.object({
  password: z
    .string({ invalid_type_error: 'Name must be a string' })
    .min(6)
    .max(20, { message: 'password must be less then 20 characters' })
    .trim()
    .optional(),
});

const changeStatusValidationSchema = z.object({
  body: z.object({
    status: z.enum([...userStatus] as [string, ...string[]]),
  }),
});

export const userValidations = {
  userValidationSchema,
  changeStatusValidationSchema,
};
