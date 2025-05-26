import { Context } from "telegraf";
import User from "../models/User";

export const StartCommand = async (ctx: Context) =>
{
   const chatId = ctx.message != null ? ctx.message.chat.id : 694873497;
   const userInformation = await User.findOne({ telegramId: chatId });
   const text = `Hi ${userInformation?.firstName}! I am Adwumawura, you personal guide to all your course materials. Let's make studying ${userInformation?.programme} easier and more fun and together!🎓🚀`;

   ctx.telegram.sendMessage(chatId, text);
};