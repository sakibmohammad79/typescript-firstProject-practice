/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';

export interface TUser {
  id: string;
  password: string;
  needsPasswordChnage: boolean;
  role: 'admin' | 'student' | 'faculty';
  status: 'in-progress' | 'blocked';
  isDeleted: boolean;
}

export interface UserModel extends Model<TUser> {
  isUserExistsByCustomId(id: string): Promise<TUser>;
  isPasswordMatched(
    planTextPassword: string,
    hashedPassword: string
  ): Promise<boolean>;
}
