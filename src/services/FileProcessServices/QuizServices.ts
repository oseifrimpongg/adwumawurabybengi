import { Context } from "telegraf";

export const QuizService = async (ctx: Context) =>
{
   await ctx.answerCbQuery("AI Quiz is coming soon!");
};