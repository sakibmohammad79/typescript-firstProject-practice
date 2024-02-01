import {
  TAcademicSemesterNameCodeMapper,
  TMonths,
  TacademicSemesterCodes,
  TacademicSemesterNames,
} from './semester.interface';

export const academicSemesterMonths: TMonths[] = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const academicSemesterNames: TacademicSemesterNames[] = [
  'Autumn',
  'Summer',
  'Fall',
];
export const academicSemesterCodes: TacademicSemesterCodes[] = [
  '01',
  '02',
  '03',
];

export const academicSemesterNameCodeMapper: TAcademicSemesterNameCodeMapper = {
  Autumn: '01',
  Summer: '02',
  Fall: '03',
};
