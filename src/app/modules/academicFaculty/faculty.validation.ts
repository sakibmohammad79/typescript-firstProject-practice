import { z } from 'zod';

const createAcademicFacultyValidationSchema = z.object({
  body: z.object({
    name: z.string({ invalid_type_error: 'Faculty name must be a string' }),
  }),
});
const updateAcademicFacultyValidationSchema = z.object({
  body: z.object({
    name: z.string({ invalid_type_error: 'Faculty name must be a string' }),
  }),
});

export const AcademicFacultyValidationSchema = {
  createAcademicFacultyValidationSchema,
  updateAcademicFacultyValidationSchema,
};
