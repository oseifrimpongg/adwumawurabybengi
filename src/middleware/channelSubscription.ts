import { NextFunction } from "express";
import { Context } from "telegraf";

export const channelSubscription = async (ctx: Context, next: NextFunction) =>
{
   const userId = ctx.chat?.id;
   if (!userId) return;

   try
   {
      const chatId = -1001630610165;
      const userId = ctx.chat != null ? ctx.chat.id : 12345;
      const member = (await ctx.telegram.getChatMember(chatId, userId));
      const isSubscribed: boolean = member.status == "administrator" || member.status == "creator" || member.status == "member";
      const isBanned: boolean = member.status == "kicked" || member.status == "restricted";

      if (isSubscribed)
      {
         return next();
      }

      if (isBanned)
      {
         return ctx.reply(
            `You cannot access this bot for either of the following reasons:\n\n- Blocked the bot\n- Violated the [Privacy Policy](https://telegra.ph/Bengi-Privacy-Policy-07-14)\n- Made spam requests to the bot\n\nKindly contact [Bengi's Father](oseifrimpongg.t.me) if you believe this is a mistake to get it resolved immediately.`,
            {
               parse_mode: "Markdown",
               link_preview_options: {
                  is_disabled: true,
               },
            }
         );
      }

      if (!isSubscribed)
      {
         return await ctx.reply(
            `Hi!\nPlease join [Bengi News](benginews.t.me) in order to access the bot.\nClick /start to enjoy the bot`,
            {
               parse_mode: "Markdown",
               link_preview_options: {
                  is_disabled: false,
                  prefer_large_media: true,
                  show_above_text: true,
               },
            }
         );

      }

   } catch (error)
   {
      console.log(`${error}`);
      return error;
   }
};
