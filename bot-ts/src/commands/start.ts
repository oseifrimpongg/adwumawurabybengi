import { Context } from "telegraf";

export const startCommand = async (ctx: Context) =>
{
   const chatId = ctx.message != null ? ctx.message.chat.id : 694873497;
   const text = `Hi! I am Adwumawura, you personal guide to all your course materials. Let's make studying easier and more fun and easier together!🎓\nFirst, choose your programme of study to get started. 🚀`;

   ctx.telegram.sendMessage(chatId, text);
};