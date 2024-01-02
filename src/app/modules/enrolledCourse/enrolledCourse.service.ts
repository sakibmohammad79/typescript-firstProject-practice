import { TEnrolledCourse } from './enrolledCourse.interface';
import { EnrolledCourse } from './enrolledCourse.model';

const createEnrolledCourseIntoDB = async (
  userId: string,
  payload: TEnrolledCourse
) => {
  const result = await EnrolledCourse.create();
  return result;
};

export const EnrolledCourseServices = {
  createEnrolledCourseIntoDB,
};
