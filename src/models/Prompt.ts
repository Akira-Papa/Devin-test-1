import mongoose, { Schema, Document } from 'mongoose';
import clientPromise from '@/lib/mongodb';

export interface IPrompt extends Document {
  userId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

// Initialize mongoose connection
const initializeMongoose = async () => {
  const client = await clientPromise;
  if (!mongoose.connections[0].readyState) {
    await mongoose.connect(process.env.MONGODB_URI as string);
  }
};

const PromptSchema = new Schema({
  userId: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Initialize mongoose connection before exporting model
initializeMongoose().catch(console.error);

export const Prompt = mongoose.models.Prompt || mongoose.model<IPrompt>('Prompt', PromptSchema);
