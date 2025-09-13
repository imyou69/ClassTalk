import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name : { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    verifyOtp: { type: String, default: '' },
    verifyOtpExpAt: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: false },
    resetOtp: { type: String, default: '' },
    resetOtpExpAt: { type: Number, default: 0 },
    role: { type: String, enum: ['student', 'teacher'], default: 'student' }, // NEW: User's role
    classrooms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Classroom' }], // NEW: Reference classrooms
}, { timestamps: true }); // Adds createdAt/updatedAt fields for user records

const userModel = mongoose.models.user || mongoose.model('user', userSchema);

export default userModel;
