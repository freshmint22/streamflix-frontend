import mongoose from 'mongoose';

export interface IFavorite extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  movieId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const favoriteSchema = new mongoose.Schema<IFavorite>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
}, { timestamps: true });

// Evitar duplicados (un usuario no puede darle “fav” la misma película 2 veces)
favoriteSchema.index({ userId: 1, movieId: 1 }, { unique: true });

export default mongoose.model<IFavorite>('Favorite', favoriteSchema);
