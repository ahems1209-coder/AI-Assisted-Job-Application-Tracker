import mongoose, { Schema, Document } from 'mongoose';

export interface IApplication extends Document {
  user: mongoose.Types.ObjectId;
  company: string;
  role: string;
  status: string;
  // add any other fields you have
}

const ApplicationSchema: Schema = new Schema({
  // This is the "Link" to the user
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  company: { type: String, required: true },
  role: { type: String, required: true },
  status: { type: String, default: 'Pending' },
}, { timestamps: true });

export default mongoose.model<IApplication>('Application', ApplicationSchema);