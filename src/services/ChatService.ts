import { Context } from "telegraf";

export const InitiateChat = async (ctx: Context) =>
{
   return await ctx.reply("Hi AI Chat 🤖 features are currently under development, you will be notified once available");
};