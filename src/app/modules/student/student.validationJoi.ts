import Joi from 'joi';

//creating a shema validation using joi
const userNameValidationSchema = Joi.object({
  firstName: Joi.string()
    .required()
    .trim()
    .regex(/^[A-Z][a-z]*$/),
  middleName: Joi.string().trim(),
  lastName: Joi.string().required().trim().alphanum(),
});

const guardianValidationSchema = Joi.object({
  fatherName: Joi.string().required().trim(),
  fatherContactNo: Joi.string().required().trim(),
  fatherOccupation: Joi.string().required().trim(),
  motherName: Joi.string().required().trim(),
  motherContactNo: Joi.string().required().trim(),
  motherOccupation: Joi.string().required().trim(),
});

const localGuardianValidationSchema = Joi.object({
  name: Joi.string().required().trim(),
  contactNo: Joi.string().required().trim(),
  occupation: Joi.string().required().trim(),
  address: Joi.string().required().trim(),
});

const studentValidationSchema = Joi.object({
  id: Joi.string().required().trim(),
  name: userNameValidationSchema.required(),
  gender: Joi.string().required().valid('male', 'female').trim(),
  contactNo: Joi.string().required().trim(),
  dateOfBirth: Joi.string().required().trim(),
  email: Joi.string().required().trim().email(),
  avatar: Joi.string().required().trim(),
  emergencyContactNo: Joi.string().required().trim(),
  bloodGroup: Joi.string()
    .required()
    .valid('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')
    .trim(),
  presentAddress: Joi.string().required().trim(),
  permanentAddress: Joi.string().required().trim(),
  guardian: guardianValidationSchema.required(),
  localGuardian: localGuardianValidationSchema.required(),
  profileImg: Joi.string().required().trim(),
  isActive: Joi.string()
    .required()
    .valid('active', 'blocked')
    .trim()
    .default('active'),
});

export default studentValidationSchema;
