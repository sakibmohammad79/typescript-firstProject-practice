import { z } from 'zod';

const createUserNameValidationSchema = z.object({
  firstName: z
    .string()
    .min(1)
    .max(255)
    .regex(/^[A-Z][a-z]*$/),
  middleName: z.string().min(1).max(255),
  lastName: z
    .string()
    .min(1)
    .max(255)
    .refine((value) => /^[a-zA-Z]+$/.test(value), {
      message: 'Last Name is not valid',
    }),
});

const createGuardianValidationSchema = z.object({
  fatherName: z.string().min(1).max(255),
  fatherContactNo: z.string().min(1).max(255),
  fatherOccupation: z.string().min(1).max(255),
  motherName: z.string().min(1).max(255),
  motherContactNo: z.string().min(1).max(255),
  motherOccupation: z.string().min(1).max(255),
});

const createLocalGuardianValidationSchema = z.object({
  name: z.string().min(1).max(255),
  contactNo: z.string().min(1).max(255),
  occupation: z.string().min(1).max(255),
  address: z.string().min(1).max(255),
});

const createStudentValidationSchema = z.object({
  body: z.object({
    password: z.string().max(20).optional(),
    student: z.object({
      name: createUserNameValidationSchema,
      gender: z.enum(['male', 'female', 'other']),
      contactNo: z.string().min(1).max(255),
      dateOfBirth: z.string().optional(),
      email: z.string().email(),
      avatar: z.string().min(1).max(255),
      emergencyContactNo: z.string().min(1).max(255),
      bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
      presentAddress: z.string().min(1).max(255),
      permanentAddress: z.string().min(1).max(255),
      guardian: createGuardianValidationSchema,
      localGuardian: createLocalGuardianValidationSchema,
      admissionSemester: z.string(),
      academicDepartment: z.string(),
      // profileImg: z.string().min(1).max(255),
    }),
  }),
});

const updateUserNameValidationSchema = z.object({
  firstName: z.string().min(1).max(255).optional(),
  middleName: z.string().min(1).max(255).optional(),
  lastName: z.string().min(1).max(255).optional(),
});

const updateGuardianValidationSchema = z.object({
  fatherName: z.string().min(1).max(255).optional(),
  fatherContactNo: z.string().min(1).max(255).optional(),
  fatherOccupation: z.string().min(1).max(255).optional(),
  motherName: z.string().min(1).max(255).optional(),
  motherContactNo: z.string().min(1).max(255).optional(),
  motherOccupation: z.string().min(1).max(255).optional(),
});

const updateLocalGuardianValidationSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  contactNo: z.string().min(1).max(255).optional(),
  occupation: z.string().min(1).max(255).optional(),
  address: z.string().min(1).max(255).optional(),
});

const updateStudentValidationSchema = z.object({
  body: z.object({
    // password: z.string().max(20).optional(),
    student: z.object({
      name: updateUserNameValidationSchema.optional(),
      gender: z.enum(['male', 'female', 'other']).optional(),
      contactNo: z.string().min(1).max(255).optional(),
      dateOfBirth: z.string().optional().optional(),
      email: z.string().email().optional(),
      avatar: z.string().min(1).max(255).optional(),
      emergencyContactNo: z.string().min(1).max(255).optional(),
      bloodGroup: z
        .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
        .optional(),
      presentAddress: z.string().min(1).max(255).optional(),
      permanentAddress: z.string().min(1).max(255).optional(),
      guardian: updateGuardianValidationSchema.optional(),
      localGuardian: updateLocalGuardianValidationSchema.optional(),
      admissionSemester: z.string().optional(),
      academicDepartment: z.string().optional(),
      profileImg: z.string().min(1).max(255).optional(),
    }),
  }),
});

export const StudentValidations = {
  createStudentValidationSchema,
  updateStudentValidationSchema,
};
