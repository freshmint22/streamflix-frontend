import mongoose, { Document, CallbackError } from 'mongoose';
import bcrypt from 'bcryptjs';

// 1️⃣ Definir una interfaz para el usuario
export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  avatar?: string | null;
  isActive: boolean;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;

  comparePassword(candidatePassword: string): Promise<boolean>;
}

// 2️⃣ Esquema
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
  avatar: {
    type: String,
    default: null,
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

// 4️⃣ Método para comparar passwords
userSchema.methods.comparePassword = async function(this: IUser, candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// 5️⃣ Exportar modelo
export default mongoose.model<IUser>('User', userSchema);