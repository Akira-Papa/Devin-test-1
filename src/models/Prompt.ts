import mongoose, { Schema, Document } from 'mongoose';

export interface IPrompt extends Document {
  userId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const PromptSchema = new Schema({
  userId: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const Prompt = mongoose.models.Prompt || mongoose.model<IPrompt>('Prompt', PromptSchema);
