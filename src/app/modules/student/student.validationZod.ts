import { z } from 'zod';

const UserNameValidationSchema = z.object({
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

const GuardianValidationSchema = z.object({
  fatherName: z.string().min(1).max(255),
  fatherContactNo: z.string().min(1).max(255),
  fatherOccupation: z.string().min(1).max(255),
  motherName: z.string().min(1).max(255),
  motherContactNo: z.string().min(1).max(255),
  motherOccupation: z.string().min(1).max(255),
});

const LocalGuardianValidationSchema = z.object({
  name: z.string().min(1).max(255),
  contactNo: z.string().min(1).max(255),
  occupation: z.string().min(1).max(255),
  address: z.string().min(1).max(255),
});

const createStudentValidationSchema = z.object({
  body: z.object({
    password: z.string().max(20),
    student: z.object({
      name: UserNameValidationSchema,
      gender: z.enum(['male', 'female', 'other']),
      contactNo: z.string().min(1).max(255),
      dateOfBirth: z.string().optional(),
      email: z.string().email(),
      avatar: z.string().min(1).max(255),
      emergencyContactNo: z.string().min(1).max(255),
      bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
      presentAddress: z.string().min(1).max(255),
      permanentAddress: z.string().min(1).max(255),
      guardian: GuardianValidationSchema,
      localGuardian: LocalGuardianValidationSchema,
      admissionSemester: z.string(),
      profileImg: z.string().min(1).max(255),
    }),
  }),
});

export const StudentValidations = {
  createStudentValidationSchema,
};
