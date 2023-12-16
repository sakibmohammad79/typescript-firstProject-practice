import mongoose from 'mongoose';
import {
  TErrorSource,
  TGenericErrorResponse,
} from '../interface/errorInterface';

const handleCastError = (
  error: mongoose.Error.CastError
): TGenericErrorResponse => {
  const errorDetails = {
    stringValue: error?.value,
    valueType: typeof error?.value,
    kind: error?.kind,
    value: error?.value,
    path: error?.path,
    reason: error?.reason,
    name: error?.name,
    message: error?.message,
  };

  const errorSources: TErrorSource = [
    {
      path: error?.path,
      message: error?.message,
    },
  ];

  const statusCode = 400;

  return {
    statusCode,
    message: 'Invalid ID',
    errorMessage: `${error?.value} is not a valid ID!`,
    errorDetails,
    errorSources,
  };
};

export default handleCastError;
