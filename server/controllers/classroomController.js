import classroomModel from '../models/classroomModel.js';
import userModel from '../models/userModel.js';
import crypto from 'crypto';

// Create a new classroom
export const createClassroom = async (req, res) => {
    try {
        const { name, description } = req.body;
        const teacherId = req.body.userId; // From userAuth middleware

        if (!name) {
            return res.json({ success: false, message: 'Classroom name is required' });
        }

        // Generate unique invite code
        const inviteCode = crypto.randomBytes(4).toString('hex').toUpperCase();

        // Create classroom document
        const classroom = new classroomModel({
            name,
            description: description || '',
            teacher: teacherId,
            inviteCode,
            students: [],
        });

        await classroom.save();

        // Add classroom to teacher's classrooms array
        await userModel.findByIdAndUpdate(teacherId, { 
            $push: { classrooms: classroom._id } 
        });

        res.json({ 
            success: true, 
            message: 'Classroom created successfully',
            classroom: {
                _id: classroom._id,
                name: classroom.name,
                description: classroom.description,
                inviteCode: classroom.inviteCode,
                teacher: classroom.teacher,
                students: classroom.students
            }
        });
    } catch (error) {
        console.error('Create classroom error:', error);
        res.json({ success: false, message: error.message });
    }
};

// Join classroom by invite code
export const joinClassroom = async (req, res) => {
    try {
        const { inviteCode } = req.body;
        const userId = req.body.userId; // From userAuth middleware

        if (!inviteCode) {
            return res.json({ success: false, message: 'Invite code is required' });
        }

        // Find classroom with exact case-sensitive invite code match
        const classroom = await classroomModel.findOne({ inviteCode: inviteCode });
        if (!classroom) {
            return res.json({ success: false, message: 'Invalid invite code' });
        }

        // Check if user is the teacher of this classroom
        if (classroom.teacher.toString() === userId) {
            return res.json({ success: false, message: 'You cannot join your own classroom as a student' });
        }

        // Check if user already enrolled
        if (classroom.students.includes(userId)) {
            return res.json({ success: false, message: 'Already joined this classroom' });
        }

        // Add student to classroom
        classroom.students.push(userId);
        await classroom.save();

        // Update user's classrooms
        await userModel.findByIdAndUpdate(userId, { 
            $push: { classrooms: classroom._id } 
        });

        res.json({ 
            success: true, 
            message: 'Joined classroom successfully', 
            classroom: {
                _id: classroom._id,
                name: classroom.name,
                description: classroom.description,
                teacher: classroom.teacher
            }
        });
    } catch (error) {
        console.error('Join classroom error:', error);
        res.json({ success: false, message: error.message });
    }
};

// Get list of classrooms user is part of (teacher or student)
export const getUserClassrooms = async (req, res) => {
    try {
        const userId = req.body.userId; // From userAuth middleware

        // Find classrooms where user is either teacher or student
        const classrooms = await classroomModel.find({
            $or: [
                { teacher: userId },
                { students: userId }
            ]
        }).populate('teacher', 'name email').populate('students', 'name email');

        res.json({ 
            success: true, 
            classrooms: classrooms.map(classroom => ({
                _id: classroom._id,
                name: classroom.name,
                description: classroom.description,
                inviteCode: classroom.inviteCode,
                teacher: classroom.teacher,
                students: classroom.students,
                isTeacher: classroom.teacher._id.toString() === userId,
                createdAt: classroom.createdAt
            }))
        });
    } catch (error) {
        console.error('Get user classrooms error:', error);
        res.json({ success: false, message: error.message });
    }
};

// Get classroom details with members
export const getClassroomDetails = async (req, res) => {
    try {
        const { classroomId } = req.params;
        const userId = req.body.userId; // From userAuth middleware

        // Find classroom and check if user is part of it
        const classroom = await classroomModel.findOne({
            _id: classroomId,
            $or: [
                { teacher: userId },
                { students: userId }
            ]
        }).populate('teacher', 'name email role').populate('students', 'name email role');

        if (!classroom) {
            return res.json({ success: false, message: 'Classroom not found or access denied' });
        }

        // Determine user's role in this classroom
        const isTeacher = classroom.teacher._id.toString() === userId;
        const userRole = isTeacher ? 'teacher' : 'student';

        // Prepare members list with roles
        const members = [
            {
                _id: classroom.teacher._id,
                name: classroom.teacher.name,
                email: classroom.teacher.email,
                role: 'teacher',
                isCurrentUser: classroom.teacher._id.toString() === userId
            },
            ...classroom.students.map(student => ({
                _id: student._id,
                name: student.name,
                email: student.email,
                role: 'student',
                isCurrentUser: student._id.toString() === userId
            }))
        ];

        res.json({ 
            success: true, 
            classroom: {
                _id: classroom._id,
                name: classroom.name,
                description: classroom.description,
                inviteCode: classroom.inviteCode,
                members: members,
                userRole: userRole,
                isTeacher: isTeacher,
                createdAt: classroom.createdAt
            }
        });
    } catch (error) {
        console.error('Get classroom details error:', error);
        res.json({ success: false, message: error.message });
    }
};

// Delete classroom (only by teacher)
export const deleteClassroom = async (req, res) => {
    try {
        const { classroomId } = req.params;
        const userId = req.body.userId; // From userAuth middleware

        // Find classroom and verify user is the teacher
        const classroom = await classroomModel.findOne({
            _id: classroomId,
            teacher: userId
        });

        if (!classroom) {
            return res.json({ success: false, message: 'Classroom not found or you are not authorized to delete it' });
        }

        // Remove classroom from all students' classrooms array
        await userModel.updateMany(
            { _id: { $in: classroom.students } },
            { $pull: { classrooms: classroom._id } }
        );

        // Remove classroom from teacher's classrooms array
        await userModel.findByIdAndUpdate(userId, {
            $pull: { classrooms: classroom._id }
        });

        // Delete the classroom
        await classroomModel.findByIdAndDelete(classroomId);

        res.json({ 
            success: true, 
            message: 'Classroom deleted successfully' 
        });
    } catch (error) {
        console.error('Delete classroom error:', error);
        res.json({ success: false, message: error.message });
    }
};
