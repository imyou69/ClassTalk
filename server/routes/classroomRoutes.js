import express from 'express';

import {
  createClassroom,
  joinClassroom,
  getUserClassrooms,
  getClassroomDetails,
  deleteClassroom,
} from '../controllers/classroomController.js';
import userAuth from '../middleware/userAuth.js';

const router = express.Router();

router.post('/', userAuth, createClassroom);           // Create a new classroom
router.post('/join', userAuth, joinClassroom);         // Join classroom by invite code
router.get('/mine', userAuth, getUserClassrooms);      // Get classrooms of logged-in user
router.get('/:classroomId', userAuth, getClassroomDetails); // Get classroom details with members
router.delete('/:classroomId', userAuth, deleteClassroom); // Delete classroom (teacher only)

export default router;
