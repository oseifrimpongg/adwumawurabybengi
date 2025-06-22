import { Context } from "telegraf";

export const ShowPastQuestions = async (ctx: Context) =>
{
   return await ctx.reply("Hi Past Questions 📖 are currently under development, you will be notified once available");
};