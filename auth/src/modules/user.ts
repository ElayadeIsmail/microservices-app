import mongoose from 'mongoose';
import { Password } from '../services/password';

// * An interface that describes the properties
// * that are required to create a new user

interface UserAtters {
  email: string;
  password: string;
}

// ? An interface that describes the props that userModel has
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAtters): UserDoc;
}

// ! An interface thet describes the props that document user has
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

const userScheme = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

// * method comes with mongoose
// ! using the function key word cuz of this
userScheme.pre('save', async function (done) {
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }
  done();
});

userScheme.statics.build = (attrs: UserAtters) => {
  return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>('User', userScheme);

export { User };
