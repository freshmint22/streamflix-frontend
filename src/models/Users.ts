import mongoose, { Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  firstName?: string;
  lastName?: string;
  age?: number;
  avatar?: string | null;
  role?: 'user' | 'admin';
  isActive: boolean;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;

  comparePassword(candidatePassword: string): Promise<boolean>;
}

interface IUserModel extends Model<IUser> {
  // add static helpers here if needed
}

const userSchema = new mongoose.Schema<IUser, IUserModel>({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  firstName: {
    type: String,
    trim: true,
    default: undefined,
  },
  lastName: {
    type: String,
    trim: true,
    default: undefined,
  },
  age: {
    type: Number,
    min: 0,
    default: undefined,
  },
  avatar: {
    type: String,
    default: null,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  resetPasswordToken: { type: String, default: undefined },
  resetPasswordExpires: { type: Date, default: undefined },
}, {
  timestamps: true,
});

// Hash password before saving
userSchema.pre<IUser>('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err as any);
  }
});

// Keep `name` in sync with firstName/lastName when provided
userSchema.pre<IUser>('save', function(next) {
  if (this.firstName) {
    this.name = `${this.firstName}${this.lastName ? ' ' + this.lastName : ''}`.trim();
  }
  next();
});

// Compare password helper
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser, IUserModel>('User', userSchema);
