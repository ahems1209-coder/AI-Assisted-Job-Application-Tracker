import mongoose, { Schema } from 'mongoose';

const ApplicationSchema = new Schema({
  company: { type: String, required: true },
  role: { type: String, required: true },
  location: { type: String },
  status: { 
    type: String, 
    default: 'Applied',
    enum: ['Applied', 'Phone Screen', 'Interview', 'Offer', 'Rejected'] 
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export default mongoose.model('Application', ApplicationSchema);