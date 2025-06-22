const { Scenes, Markup } = require('telegraf');
const { WizardScene } = Scenes;
const { SaveUserInformation } = require("../db/user");
const { StartCommand } = require("../commands/start");

const programmeYears = {
   Nursing: ["Year 1", "Year 2", "Year 3", "Year 4"],
   Midwifery: ["Year 1", "Year 2", "Year 3", "Year 4"],
   "Emergency Nursing": ["Year 3", "Year 4"]
};

export const registrationWizard = new WizardScene(
   "registration-wizard",
   async (ctx) =>
   {
      ctx.session.registration = {};
      await ctx.reply("👋 Welcome to *Adwumawura*\n📚 Your assistant for accessing learning materials with ease.\n\nBy continuing to use this service, you acknowledge and accept that your information may be collected and used in accordance with our [Privacy Policy](https://telegra.ph/Bengi-Privacy-Policy-07-14). 🔒 We are committed to handling your data responsibly and securely.\nThank you for choosing Adwumawura Bot. 😊",
         {
            parse_mode: "Markdown",
            link_preview_options: {
               is_disabled: true
            }
         });

      await new Promise(resolve => setTimeout(resolve, 2000));

      await ctx.reply("To get started, we’d like to know a bit about you.\nPlease provide the following details:");

      await new Promise(resolve => setTimeout(resolve, 2000));

      await ctx.reply("1️⃣ *First Name*", { parse_mode: "Markdown" });
      return ctx.wizard.next();
   },
   async (ctx) =>
   {
      ctx.session.registration.firstName = ctx.message?.text;
      await ctx.reply("2️⃣ *Last Name*", { parse_mode: "Markdown" });
      return ctx.wizard.next();
   },
   async (ctx) =>
   {
      ctx.session.registration.lastName = ctx.message?.text;
      await ctx.reply("3️⃣ *Programme of Study*", {
         reply_markup: {
            keyboard: [
               [{ text: "Nursing" }, { text: "Midwifery" }], [{ text: "Emergency Nursing" }]
            ],
            one_time_keyboard: true,
            resize_keyboard: true
         }, parse_mode: "Markdown"
      });
      return ctx.wizard.next();
   },
   async (ctx) =>
   {
      const programme = ctx.message?.text;
      if (!programmeYears[programme])
      {
         return await ctx.reply("Invalid programme. Use buttons.");
      }
      ctx.session.registration.programme = programme;

      const years = programmeYears[programme];
      const chunkedYears: { text: string; }[][] = [];
      for (let i = 0; i < years.length; i += 2)
      {
         chunkedYears.push(years.slice(i, i + 2).map(y => ({ text: y })));
      }

      await ctx.replyWithMarkdownV2(
         "4️⃣ *Year of Study*",
         Markup.keyboard(chunkedYears).oneTime().resize()
      );

      return ctx.wizard.next();
   },
   async (ctx) =>
   {
      ctx.session.registration.year = ctx.message?.text;
      const { firstName, lastName, programme, year } = ctx.session.registration;
      await ctx.replyWithMarkdownV2(
         `*Your Information*:\n\nName: *${firstName} ${lastName}*\nProgramme: *${programme}*\nYear: *${year.replace("Year ", "")}*\n\nPlease confirm the data is accurate`,
         Markup.keyboard([['Confirm ✅'], ['Cancel ❌']]).oneTime().resize()
      );
      return ctx.wizard.next();
   },
   async (ctx) =>
   {
      const isConfirmed = ctx.message?.text === 'Confirm ✅';

      await ctx.reply(
         isConfirmed ? "Registration complete! ✅ " : " Registration cancelled. ❌",
         Markup.removeKeyboard()
      );

      if (isConfirmed)
      {
         try
         {
            let { firstName, lastName, programme, year } = ctx.session.registration;
            year = Number(year.replace("Year ", ""));
            const telegramId = Number(ctx.from.id);
            await SaveUserInformation(telegramId, firstName, lastName, programme, year);
            await ctx.scene.leave();
            return StartCommand(ctx);
         } catch (error)
         {
            console.error("SaveUserInformation Error:", error);
         }
      } else
      {
         return ctx.scene.enter('registration-wizard');
      }
   }
);
