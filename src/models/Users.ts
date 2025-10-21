import mongoose, { Document, Schema, CallbackError, Model } from "mongoose";
import bcrypt from "bcryptjs";

/**
 * Interfaz del documento de usuario.
 */
export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  firstName?: string;
  lastName?: string;
  age?: number;
  avatar?: string | null;
  role?: "user" | "admin";
  isActive: boolean;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

/**
 * Esquema del usuario.
 */
const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    name: {
      type: String,
      required: [true, "Name is required"],
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
      enum: ["user", "admin"],
      default: "user",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  {
    timestamps: true,
  }
);

/**
 * Middleware para encriptar la contraseña antes de guardar.
 */
userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as CallbackError);
  }
});

/**
 * Mantiene `name` sincronizado con `firstName` y `lastName` si existen.
 */
userSchema.pre<IUser>("save", function (next) {
  if (this.firstName) {
    this.name = `${this.firstName}${
      this.lastName ? " " + this.lastName : ""
    }`.trim();
  }
  next();
});

/**
 * Método para comparar contraseñas.
 */
userSchema.methods.comparePassword = async function (
  this: IUser,
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

/**
 * Exportar modelo.
 */
const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);
export default User;
