import mongoose, { Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

// Interface para los métodos de instancia
export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  avatar?: string;
  isActive: boolean;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
  
  // Método personalizado
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Interface para el modelo estático
interface IUserModel extends Model<IUser> {
  // Aquí podrías agregar métodos estáticos si los necesitas
}

const userSchema = new mongoose.Schema<IUser, IUserModel>({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  avatar: {
    type: String,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date
}, {
  timestamps: true
});

// Hash password antes de guardar
userSchema.pre('save', async function(this: IUser, next: (err?: mongoose.CallbackError) => void) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    // catch() error is typed as unknown in TS; cast to mongoose.CallbackError for next()
    next(error as mongoose.CallbackError);
  }
});

// Método para comparar passwords
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser, IUserModel>('User', userSchema);