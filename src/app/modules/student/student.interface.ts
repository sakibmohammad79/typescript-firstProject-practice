import { Model } from 'mongoose';

export type TGuardian = {
  fatherName: string;
  fatherContactNo: string;
  fatherOccupation: string;
  motherName: string;
  motherContactNo: string;
  motherOccupation: string;
};

export type TUserName = {
  firstName: string;
  middleName: string;
  lastName: string;
};

export type TLocalGaurdian = {
  name: string;
  contactNo: string;
  occupation: string;
  address: string;
};

export type TStudent = {
  id: string;
  name: TUserName;
  gender: 'male' | 'female';
  contactNo: string;
  dateOfBirth?: string;
  email: string;
  avatar?: string;
  emergencyContactNo: string;
  bloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  presentAddress: string;
  permanentAddress: string;
  guardian: TGuardian;
  localGuardian: TLocalGaurdian;
  profileImg?: string;
  isActive: 'active' | 'blocked';
};

export type StudentMethods = {
  isUserExists(id: string): Promise<TStudent | null>;
};

export type StudentModel = Model<
  TStudent,
  Record<string, never>,
  StudentMethods
>;
