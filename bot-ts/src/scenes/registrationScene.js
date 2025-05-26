const { Scenes, Markup } = require('telegraf');
const { WizardScene } = Scenes;
const { SaveUserInformation } = require("../db/functions");
const { StartCommand } = require("../commands/start")

const programmeYears = {
   Nursing: ["Year 1", "Year 2", "Year 3", "Year 4"],
   Midwifery: ["Year 1", "Year 2", "Year 3", "Year 4"],
   "Emergency Nursing": ["Year 3", "Year 4"]
};

const registrationWizard = new WizardScene(
   "registration-wizard",
   async (ctx) =>
   {
      ctx.session.registration = {};
      await ctx.reply("What's your first name?");
      return ctx.wizard.next();
   },
   async (ctx) =>
   {
      ctx.session.registration.firstName = ctx.message?.text;
      await ctx.reply("What's your last name?");
      return ctx.wizard.next();
   },
   async (ctx) =>
   {
      ctx.session.registration.lastName = ctx.message?.text;
      await ctx.reply("Select your programme:", Markup.keyboard([
         ['Nursing'], ['Midwifery'], ['Emergency Nursing']
      ]).oneTime().resize());
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
      await ctx.reply("Select your year:", Markup.keyboard(
         programmeYears[programme].map(y => [y])
      ).oneTime().resize());
      return ctx.wizard.next();
   },
   async (ctx) =>
   {
      ctx.session.registration.year = ctx.message?.text;
      const { firstName, lastName, programme, year } = ctx.session.registration;
      await ctx.reply(
         `Confirm:\n${firstName} ${lastName}\nProgramme: ${programme}\nYear: ${year.replace("Year ", "")}`,
         Markup.keyboard([['Confirm'], ['Cancel']]).oneTime().resize()
      );
      return ctx.wizard.next();
   },
   async (ctx, next) =>
   {
      const isConfirmed = ctx.message?.text === 'Confirm';

      await ctx.reply(
         isConfirmed ? "✅ Registration complete!" : "❌ Registration cancelled.",
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
         } catch (error)
         {
            console.error("SaveUserInformation Error:", error);
         }
      }

      await ctx.scene.leave();

      return StartCommand(ctx);
   }
);

module.exports = registrationWizard;
