import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema({
  classroom: { type: mongoose.Schema.Types.ObjectId, ref: 'classroom', required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  content: { type: String, required: true },
  title: { type: String, required: true }
}, { timestamps: true });

const announcementModel = mongoose.models.announcement || mongoose.model('announcement', announcementSchema);

export default announcementModel;
