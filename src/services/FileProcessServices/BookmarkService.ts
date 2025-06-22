import { Context } from "telegraf";

export const BookmarkService = async (ctx: Context) =>
{
   await ctx.answerCbQuery("Bookmarks are coming soon!");
};