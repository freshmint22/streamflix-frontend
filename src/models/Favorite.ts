import mongoose, { Document, Model } from 'mongoose';

/**
 * Interface representing a Favorite document in MongoDB.
 */
export interface IFavorite extends Document {
  /** Reference to the owning user */
  userId: mongoose.Schema.Types.ObjectId | string;
  /** Reference to the favorited movie */
  movieId: mongoose.Schema.Types.ObjectId | string;
  /** Optional note attached by the user */
  note?: string;
}

interface IFavoriteModel extends Model<IFavorite> {}

/**
 * Favorite schema stores the relation between a user and a movie marked as favorite.
 */
const favoriteSchema = new mongoose.Schema<IFavorite, IFavoriteModel>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
  note: { type: String, default: undefined },
}, { timestamps: true });

export default mongoose.model<IFavorite, IFavoriteModel>('Favorite', favoriteSchema);
