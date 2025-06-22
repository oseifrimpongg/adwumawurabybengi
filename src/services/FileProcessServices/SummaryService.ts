import { Context } from "telegraf";

export const SummaryService = async (ctx: Context) =>
{
   await ctx.answerCbQuery("AI Summary is coming soon!");
};