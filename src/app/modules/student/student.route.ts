import express from 'express';
import { studentController } from './student.controller';

const router = express.Router();
router.get('/', studentController.getAllStudent);

router.get('/:studentId', studentController.getSingleStudent);

router.delete('/:studentId', studentController.deleteStudent);

export const StudentRoutes = router;
