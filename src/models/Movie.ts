import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  genre: [{
    type: String,
    required: [true, 'At least one genre is required']
  }],
  duration: {
    type: Number,
    required: [true, 'Duration is required'],
    min: [1, 'Duration must be at least 1 minute']
  },
  releaseYear: {
    type: Number,
    required: [true, 'Release year is required'],
    min: [1900, 'Release year must be after 1900']
  },
  director: {
    type: String,
    required: [true, 'Director is required']
  },
  cast: [{
    type: String,
    required: [true, 'At least one cast member is required']
  }],
  videoUrl: {
    type: String,
    required: [true, 'Video URL is required']
  },
  thumbnailUrl: {
    type: String,
    required: [true, 'Thumbnail URL is required']
  },
  trailerUrl: {
    type: String,
    default: null
  },
  language: {
    type: String,
    default: 'es'
  },
  subtitles: {
    es: String,
    en: String
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Índices para búsqueda eficiente
movieSchema.index({ title: 'text', description: 'text' });
movieSchema.index({ genre: 1 });
movieSchema.index({ releaseYear: -1 });

export default mongoose.model('Movie', movieSchema);