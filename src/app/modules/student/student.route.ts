import express from 'express';
import { studentController } from './student.controller';

const router = express.Router();

//will call controller function
router.post('/create-student', studentController.createStudent);

router.get('/:studentId', studentController.getSingleStudent);

router.delete('/:studentId', studentController.deleteStudent);

router.get('/', studentController.getAllStudent);

export const StudentRoutes = router;
