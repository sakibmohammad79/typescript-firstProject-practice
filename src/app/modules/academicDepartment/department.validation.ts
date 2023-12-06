import { z } from 'zod';

const createAcademicDepartmentValidationSchema = z.object({
  body: z.object({
    name: z.string({
      invalid_type_error: 'Faculty name must be a string',
      required_error: 'department name required',
    }),
    academicFaculty: z.string({
      invalid_type_error: 'Faculty name must be a string',
      required_error: 'Faculty is required',
    }),
  }),
});
const updateAcademicDepartmentValidationSchema = z.object({
  body: z.object({
    name: z
      .string({
        invalid_type_error: 'Faculty name must be a string',
        required_error: 'department name required',
      })
      .optional(),
    academicFaculty: z
      .string({
        invalid_type_error: 'Faculty name must be a string',
        required_error: 'Faculty is required',
      })
      .optional(),
  }),
});

export const AcademicDepartmentValidation = {
  createAcademicDepartmentValidationSchema,
  updateAcademicDepartmentValidationSchema,
};
