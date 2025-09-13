import mongoose from 'mongoose';

const classroomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
  inviteCode: { type: String, unique: true }
}, { timestamps: true });

const classroomModel = mongoose.models.classroom || mongoose.model('classroom', classroomSchema);

export default classroomModel;
