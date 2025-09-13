import Classroom from '../models/classroomModel.js';
import User from '../models/userModel.js';
import crypto from 'crypto';

// Create a new classroom
export const createClassroom = async (req, res) => {
  try {
    const { name, description } = req.body;
    const teacherId = req.user._id;

    // Generate unique invite code
    const inviteCode = crypto.randomBytes(4).toString('hex');

    // Create classroom document
    const classroom = new Classroom({
      name,
      description,
      teacher: teacherId,
      inviteCode,
      students: [],
    });

    await classroom.save();

    // Optionally add classroom to teacher's classrooms array
    await User.findByIdAndUpdate(teacherId, { $push: { classrooms: classroom._id } });

    res.status(201).json({ success: true, classroom });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Join classroom by invite code
export const joinClassroom = async (req, res) => {
  try {
    const { inviteCode } = req.body;
    const userId = req.user._id;

    const classroom = await Classroom.findOne({ inviteCode });
    if (!classroom) return res.status(404).json({ success: false, message: 'Invalid invite code' });

    // Check if user already enrolled
    if (classroom.students.includes(userId)) {
      return res.status(400).json({ success: false, message: 'Already joined this classroom' });
    }

    classroom.students.push(userId);
    await classroom.save();

    // Update user's classrooms
    await User.findByIdAndUpdate(userId, { $push: { classrooms: classroom._id } });

    res.json({ success: true, message: 'Joined classroom successfully', classroom });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get list of classrooms user is part of (teacher or student)
export const getUserClassrooms = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch classrooms where user is teacher or student
    const classrooms = await Classroom.find({
      $or: [{ teacher: userId }, { students: userId }],
    }).populate('teacher', 'name').populate('students', 'name');

    res.json({ success: true, classrooms });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
