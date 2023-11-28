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

const StudentValidationSchema = z.object({
  id: z.string().min(1).max(255),
  name: UserNameValidationSchema,
  gender: z.enum(['male', 'female']),
  contactNo: z.string().min(1).max(255),
  dateOfBirth: z.string().min(1).max(255),
  email: z.string().email(),
  avatar: z.string().min(1).max(255),
  emergencyContactNo: z.string().min(1).max(255),
  bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
  presentAddress: z.string().min(1).max(255),
  permanentAddress: z.string().min(1).max(255),
  guardian: GuardianValidationSchema,
  localGuardian: LocalGuardianValidationSchema,
  profileImg: z.string().min(1).max(255),
  isActive: z.enum(['active', 'blocked']).default('active'),
  isDeleted: z.boolean(),
});

export default StudentValidationSchema;
