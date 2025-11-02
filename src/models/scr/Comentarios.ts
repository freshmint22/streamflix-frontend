import mongoose, { Schema, Document } from "mongoose";

interface IComment extends Document {
  movieId: string;
  userEmail: string;
  content: string;
  createdAt: Date;
}

const commentSchema = new Schema<IComment>({
  movieId: { type: String, required: true },
  userEmail: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IComment>("Comment", commentSchema);
