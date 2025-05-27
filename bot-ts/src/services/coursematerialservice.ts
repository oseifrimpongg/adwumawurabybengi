import { Context } from "telegraf";
import User, { IUser } from "../models/User";
import { Document } from "mongoose";

export const ShowSemesters = async (ctx: Context) =>
{
   const userData = await User.findOne({ telegramId: ctx.chat?.id });
   const requestedData = ["Course Materials 📙", "Past Questions 🯄"].filter(input => input == ctx.text)[0];

   return await ctx.reply(
      `Welcome to your ${requestedData}, go ahead and choose a semester below:`,
      {
         parse_mode: "Markdown",
         reply_markup: {
            inline_keyboard: [
               [
                  { text: "First Semester", callback_data: GenerateCallback(1, userData) },
                  { text: "Second Semester", callback_data: GenerateCallback(2, userData) }
               ]
            ]
         }
      });
};


function GenerateCallback(semester: number, data: (Document<unknown, {}, IUser, {}> & IUser & Required<{ _id: unknown; }> & { __v: number; }) | null)
{
   return JSON.stringify({
      a: "sem",
      s: semester,
      y: data?.year,
      p: `${data?.programme.substring(0, 3)}`
   });
}