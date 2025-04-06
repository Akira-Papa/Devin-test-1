import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User';

export interface IPost extends Document {
  content: string;
  author: IUser['_id'];
  media?: string[];
  likes: IUser['_id'][];
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema: Schema = new Schema(
  {
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    media: [{ type: String }],
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

export default mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema);
