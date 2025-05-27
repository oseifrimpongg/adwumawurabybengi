import { Context } from "telegraf";
import User from "../models/User";

export const StartCommand = async (ctx: Context) =>
{
   const chatId = ctx.message != null ? ctx.message.chat.id : 694873497;
   const userInformation = await User.findOne({ telegramId: chatId });
   const text = `Hi ${userInformation?.firstName}! I am Adwumawura, you personal guide to all your course materials. Let's make studying ${userInformation?.programme} easier and more fun and together!🎓🚀`;

   return ctx.telegram.sendMessage(chatId, text,
      {
         reply_markup: {
            keyboard: [
               [{ text: "Course Materials 📙" }, { text: "Past Questions 🯄" }], [{ text: "AI Chat 🤖" }]
            ],
            one_time_keyboard: true,
            resize_keyboard: true
         }, parse_mode: "Markdown"
      });
};


/*
Course Materials,
past questions
ai chat

each learning material should have three buttons,
- summary button
- quiz button
- bookmark will come later
*/