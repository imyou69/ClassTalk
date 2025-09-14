import express from 'express';
import {
  createAnnouncement,
  getClassroomAnnouncements,
  deleteAnnouncement,
} from '../controllers/announcementController.js';
import userAuth from '../middleware/userAuth.js';

const router = express.Router();

router.post('/', userAuth, createAnnouncement);                    // Create announcement
router.get('/classroom/:classroomId', userAuth, getClassroomAnnouncements); // Get classroom announcements
router.delete('/:announcementId', userAuth, deleteAnnouncement);   // Delete announcement

export default router;
