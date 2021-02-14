import { Schema, Document, HookNextFunction, model } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
  _id: string;
  email: string;
  password: string;
  swapiHeroId: string;
  comparePassword: (password: string) => Promise<boolean>;
}

const UserSchema: Schema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    swapiHeroId: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

// mongoose requires it
// eslint-disable-next-line func-names
UserSchema.pre<IUser>(
  'save',
  async function (next: HookNextFunction): Promise<HookNextFunction> {
    // mongoose requires it
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const user = this;

    if (!user.isModified('password')) return next();

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;

    return next();
  }
);

// mongoose requires it
// eslint-disable-next-line func-names
UserSchema.methods.comparePassword = async function (
  password: string
): Promise<boolean> {
  // TODO fix
  // @ts-ignore: Unreachable code error
  return bcrypt.compare(password, this.password);
};

const User = model<IUser>('User', UserSchema);

export default User;
