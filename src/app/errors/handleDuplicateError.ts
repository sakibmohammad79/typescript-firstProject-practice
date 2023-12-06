import {
  TErrorSource,
  TGenericErrorResponse,
} from '../interface/errorInterface';

const handleDuplicateError = (error: any): TGenericErrorResponse => {
  // Using regular expression to extract the department name
  const match = error.message.match(/"([^"]*)"/);
  const extractMessage = match ? match[1] : null;
  const errorSources: TErrorSource = [
    {
      path: '',
      message: `${extractMessage} is already exists!`,
    },
  ];

  const statusCode = 400;

  return {
    statusCode,
    message: 'Invalid Id',
    errorSources,
  };
};

export default handleDuplicateError;
