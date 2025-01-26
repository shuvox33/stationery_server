import { model, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import { TUser, UserModel } from './user.interface';
import config from '../../config';

const userSchema = new Schema<TUser, UserModel>(
  {
    name: { type: String, required: [true, 'Name is required'] },
    imgae: { type: String },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      select: false,
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
    isBlocked: { type: Boolean, default: false },
  },
  { timestamps: true },
);

// hashing password before saving
userSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcryptSaltRounds),
  );
  next();
});

// checking password is matched or not
userSchema.statics.isPasswordMatched = async function (
  password: string,
  hashedPassword: string,
) {
  return await bcrypt.compare(password, hashedPassword);
};

// checking user is exist or not
userSchema.statics.isUserExist = async function (email: string) {
  return await User.findOne({ email }).select('+password');
};

export const User = model<TUser, UserModel>('User', userSchema);
