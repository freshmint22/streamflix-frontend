import mongoose, { Document, CallbackError } from 'mongoose';
import bcrypt from 'bcryptjs';

// 1️⃣ Definir una interfaz para el usuario
/**
 * User document interface.
 */
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

// 2️⃣ Schema
const userSchema = new mongoose.Schema<IUser>({
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
  resetPasswordToken: String,
  resetPasswordExpires: Date,
}, {
  timestamps: true,
});

// 3️⃣ Hash password antes de guardar
userSchema.pre<IUser>('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    // 👇 Convertir error a CallbackError para TypeScript
    next(error as CallbackError);
  }
});

// Keep `name` in sync with firstName/lastName when provided
userSchema.pre<IUser>('save', function(next) {
  if (this.firstName) {
    this.name = `${this.firstName}${this.lastName ? ' ' + this.lastName : ''}`.trim();
  }
  next();
});

// 4️⃣ Método para comparar passwords
userSchema.methods.comparePassword = async function(this: IUser, candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// 5️⃣ Exportar modelo
export default mongoose.model<IUser>('User', userSchema);