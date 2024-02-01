import config from '../config';
import { USER_ROLE } from '../modules/user/user.constant';
import { User } from '../modules/user/user.schema.model';

const userAdmin = {
  id: '0001',
  email: 'superadmin@gmail.com',
  password: config.super_admin_password,
  needsPasswordChnage: false,
  role: USER_ROLE.superAdmin,
  status: 'in-progress',
  isDeleted: false,
};

const seedSuperAdmin = async () => {
  //when database is connected, we will check is there any user, who is super admin
  const isSuperAdminExists = await User.findOne({ role: USER_ROLE.superAdmin });

  if (!isSuperAdminExists) {
    const result = await User.create(userAdmin);
    return result;
  }
};

export default seedSuperAdmin;
