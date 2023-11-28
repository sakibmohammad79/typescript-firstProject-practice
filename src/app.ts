/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import globalErrorHandler from './app/middlewars/globalErrorHandler';
import notFound from './app/middlewars/notFound';
import router from './app/router';
const app: Application = express();

//parsers
app.use(express.json());
app.use(cors());

//application routes
app.use('/api/v1', router);

const test = (req: Request, res: Response) => {
  res.send('Hello world');
};
app.get('/', test);

//global error handler
app.use(globalErrorHandler);

//not found route
app.use(notFound);

export default app;
