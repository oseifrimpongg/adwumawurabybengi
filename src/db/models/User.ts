import mongoose, { Document, mongo, Schema } from "mongoose";

export interface IUser extends Document
{
   telegramId: number,
   firstName: string,
   lastName: string,
   programme: string,
   year: number;
   registeredAt: Date;
}

const UserSchema = new Schema<IUser>(
   {
      telegramId: { type: Number, required: true, unique: true },
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      programme: { type: String, required: true },
      year: { type: Number, required: true },
      registeredAt: { type: Date, default: Date.now }
   });

const User = mongoose.model<IUser>("User", UserSchema, "Users");
export default User;