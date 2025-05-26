import User from "../models/User";

export const SaveUserInformation = async (telegramId: number, firstName: string, lastName: string, programme: string, year: number) =>
{
   const existingUser = await User.findOne({ telegramId });
   if (existingUser != null) return;

   const userInformation = new User({
      telegramId,
      firstName,
      lastName,
      programme,
      year
   });

   await userInformation.save();
   return;
};