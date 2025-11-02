import mongoose from 'mongoose';

/**
 * Subtitle model
 * Stores a URL to a VTT subtitle file for a given movie in a given language.
 */
export interface ISubtitle extends mongoose.Document {
  movieId: mongoose.Types.ObjectId;
  language: 'es' | 'en';
  url: string;
  createdAt: Date;
  updatedAt: Date;
}

const subtitleSchema = new mongoose.Schema<ISubtitle>({
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: true,
  },
  language: {
    type: String,
    enum: ['es', 'en'],
    required: true,
  },
  url: {
    type: String,
    required: true,
    trim: true,
  },
}, { timestamps: true });

// A movie can have at most one subtitle per language
subtitleSchema.index({ movieId: 1, language: 1 }, { unique: true });

export default mongoose.model<ISubtitle>('Subtitle', subtitleSchema);
