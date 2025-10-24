import mongoose from 'mongoose';

/**
 * Playback document interface - stores last position and state for a user/movie.
 */
export interface IPlayback extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  movieId: string;
  position: number;
  state: 'playing' | 'paused' | 'stopped';
}

/**
 * Schema: records playback position and state for a user and movie.
 */
const playbackSchema = new mongoose.Schema<IPlayback>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  movieId: { type: String, required: true },
  position: { type: Number, default: 0 },
  state: { type: String, enum: ['playing', 'paused', 'stopped'], default: 'stopped' },
}, { timestamps: true });

export default mongoose.model<IPlayback>('Playback', playbackSchema);
