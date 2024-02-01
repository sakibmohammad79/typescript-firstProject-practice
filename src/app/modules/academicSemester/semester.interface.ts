export type TMonths =
  | 'January'
  | 'February'
  | 'March'
  | 'April'
  | 'May'
  | 'June'
  | 'July'
  | 'August'
  | 'September'
  | 'October'
  | 'November'
  | 'December';

export type TacademicSemesterNames = 'Autumn' | 'Summer' | 'Fall';
export type TacademicSemesterCodes = '01' | '02' | '03';

export type TAcademicSemester = {
  name: TacademicSemesterNames;
  year: string;
  code: TacademicSemesterCodes;
  startMonth: TMonths;
  endMonth: TMonths;
};

export type TAcademicSemesterNameCodeMapper = {
  [key: string]: string;
};
