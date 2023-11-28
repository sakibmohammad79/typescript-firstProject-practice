import { z } from 'zod';

const userValidationSchema = z.object({
  password: z
    .string({ invalid_type_error: 'Name must be a string' })
    .min(6)
    .max(20, { message: 'password must be less then 20 characters' })
    .trim()
    .optional(),
});

export default userValidationSchema;
