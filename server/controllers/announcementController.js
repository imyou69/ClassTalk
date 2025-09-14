import announcementModel from '../models/announcementModel.js';
import classroomModel from '../models/classroomModel.js';

// Create a new announcement
export const createAnnouncement = async (req, res) => {
    try {
        const { classroomId, title, content } = req.body;
        const userId = req.body.userId; // From userAuth middleware

        if (!title || !content) {
            return res.json({ success: false, message: 'Title and content are required' });
        }

        // Verify user is the teacher of this classroom
        const classroom = await classroomModel.findOne({
            _id: classroomId,
            teacher: userId
        });

        if (!classroom) {
            return res.json({ success: false, message: 'Classroom not found or you are not authorized to post announcements' });
        }

        // Create announcement
        const announcement = new announcementModel({
            classroom: classroomId,
            author: userId,
            title,
            content
        });

        await announcement.save();

        // Populate author details for response
        await announcement.populate('author', 'name email');

        res.json({ 
            success: true, 
            message: 'Announcement posted successfully',
            announcement: {
                _id: announcement._id,
                title: announcement.title,
                content: announcement.content,
                author: announcement.author,
                createdAt: announcement.createdAt
            }
        });
    } catch (error) {
        console.error('Create announcement error:', error);
        res.json({ success: false, message: error.message });
    }
};

// Get announcements for a classroom
export const getClassroomAnnouncements = async (req, res) => {
    try {
        const { classroomId } = req.params;
        const userId = req.body.userId; // From userAuth middleware

        // Verify user is part of this classroom (teacher or student)
        const classroom = await classroomModel.findOne({
            _id: classroomId,
            $or: [
                { teacher: userId },
                { students: userId }
            ]
        });

        if (!classroom) {
            return res.json({ success: false, message: 'Classroom not found or access denied' });
        }

        // Get announcements with author details
        const announcements = await announcementModel
            .find({ classroom: classroomId })
            .populate('author', 'name email')
            .sort({ createdAt: -1 }); // Most recent first

        res.json({ 
            success: true, 
            announcements: announcements.map(announcement => ({
                _id: announcement._id,
                title: announcement.title,
                content: announcement.content,
                author: announcement.author,
                createdAt: announcement.createdAt
            }))
        });
    } catch (error) {
        console.error('Get classroom announcements error:', error);
        res.json({ success: false, message: error.message });
    }
};

// Delete announcement (only by author/teacher)
export const deleteAnnouncement = async (req, res) => {
    try {
        const { announcementId } = req.params;
        const userId = req.body.userId; // From userAuth middleware

        // Find announcement and verify user is the author
        const announcement = await announcementModel.findOne({
            _id: announcementId,
            author: userId
        });

        if (!announcement) {
            return res.json({ success: false, message: 'Announcement not found or you are not authorized to delete it' });
        }

        await announcementModel.findByIdAndDelete(announcementId);

        res.json({ 
            success: true, 
            message: 'Announcement deleted successfully' 
        });
    } catch (error) {
        console.error('Delete announcement error:', error);
        res.json({ success: false, message: error.message });
    }
};
