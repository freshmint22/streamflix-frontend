import mongoose, { Document, Model } from 'mongoose';

/**
 * Minimal metadata stored for a favorited movie so the client can render cards
 * without performing a second lookup.
 */
export interface FavoriteMovieMeta {
  id: string;
  title?: string;
  posterUrl?: string;
  year?: number;
  videoUrl?: string;
  overview?: string;
  rating?: number;
}

/**
 * Interface representing a Favorite document in MongoDB.
 */
export interface IFavorite extends Document {
  /** Reference to the owning user */
  userId: mongoose.Schema.Types.ObjectId;
  /** External movie identifier (string from TMDB or internal catalogue) */
  movieId: string;
  /** Snapshot of the movie metadata used to render favorites quickly */
  movie?: FavoriteMovieMeta;
  /** Optional note attached by the user */
  note?: string;
}

interface IFavoriteModel extends Model<IFavorite> {}

/**
 * Favorite schema stores the relation between a user and a movie marked as favorite.
 * We keep a denormalised copy of basic movie data so the frontend can display
 * favorites without having to query another collection.
 */
const favoriteSchema = new mongoose.Schema<IFavorite, IFavoriteModel>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  movieId: { type: String, required: true },
  movie: {
    id: String,
    title: String,
    posterUrl: String,
    year: Number,
    videoUrl: String,
    overview: String,
    rating: Number,
  },
  note: { type: String, default: undefined },
}, { timestamps: true });

favoriteSchema.index({ userId: 1, movieId: 1 }, { unique: true });

export default mongoose.model<IFavorite, IFavoriteModel>('Favorite', favoriteSchema);
