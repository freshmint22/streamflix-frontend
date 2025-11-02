import mongoose from 'mongoose';

export interface IRating extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  movieId: mongoose.Types.ObjectId;
  rating: number; // 1..5
  createdAt: Date;
  updatedAt: Date;
}

const ratingSchema = new mongoose.Schema<IRating>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
}, { timestamps: true });

// Un usuario tiene una sola calificación por película
ratingSchema.index({ userId: 1, movieId: 1 }, { unique: true });

export default mongoose.model<IRating>('Rating', ratingSchema);
