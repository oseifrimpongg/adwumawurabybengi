import User from "../db/models/User";
import { Context } from "telegraf";
import { MyContext } from "../types/types";
import { GenerateCallback } from "../utils/GenerateCallback";
import { Course, CourseFile } from "../types/courseMaterialTypes";
import { InlineKeyboardButton } from "telegraf/typings/core/types/typegram";
import { FileProcessAction, ICallbackData, IFileData, LearningMaterial } from "../types/callbackTypes";
import { GetCourses, GetFileByIndex, GetFiles } from "../db/slide";


export const ShowSemesters = async (ctx: Context, previousPage?: ICallbackData) =>
{
   const userData = await User.findOne({ telegramId: ctx.chat?.id });
   let requestedData = ["Course Materials 📙", "Past Questions 🯄"].filter(input => input == ctx.text)[0];

   let text = `Welcome to your ${requestedData}, go ahead and choose a semester below:`;
   const keyboard = [
      [
         { text: "First Semester", callback_data: GenerateCallback(LearningMaterial.Lecture, 1, userData) },
         { text: "Second Semester", callback_data: GenerateCallback(LearningMaterial.Lecture, 2, userData) }
      ]
   ];

   if (previousPage != null)
   {
      requestedData = previousPage?.a === "lsem" ? "Course Materials 📙" : "Past Questions 🯄";

      text = `Welcome to your ${requestedData}, go ahead and choose a semester below:`;
      return await ctx.editMessageText(text, {
         parse_mode: "Markdown",
         reply_markup: { inline_keyboard: keyboard }
      });
   }

   return await ctx.reply(text, {
      parse_mode: "Markdown",
      reply_markup: { inline_keyboard: keyboard }
   });
};


export const ShowCourses = async (ctx: MyContext, previousPage: ICallbackData) =>
{
   try
   {
      const courses: Course[] = await GetCourses(previousPage);

      const keyboard = courses.map(course =>
      {
         const callback: ICallbackData = {
            a: "c", // Course
            s: previousPage.s,
            p: previousPage.p,
            y: previousPage.y,
            c: course.code
         };
         return [{ text: course.title, callback_data: JSON.stringify(callback) }];
      });

      keyboard.push([{ text: "⬅️ Go Back", callback_data: JSON.stringify({ a: "lsem", s: previousPage.s, y: previousPage.y, p: previousPage.p }) }]);

      return await ctx.editMessageText("Please choose a course below:", { reply_markup: { inline_keyboard: keyboard }, parse_mode: "Markdown" });
   } catch (error)
   {
      await ctx.reply(`${error}`);
      console.log(`${error}`);
   }
};


export const ShowFiles = async (ctx: MyContext, previousPage: ICallbackData) =>
{
   try
   {
      const courses: Course[] = await GetFiles(previousPage);
      const courseFiles = courses.filter(course => course.code == previousPage.c)[0];
      let text = `You chose *${courseFiles.title}*. \nPlease choose a file below:\n\n`;
      text += courseFiles.files.map((courseFile, index) => `*${index + 1}*. ${courseFile.fileName}`).join("\n");

      const keyboard: any[][] = [];

      courseFiles.files.forEach((courseFile, index) =>
      {
         const callback: IFileData = {
            a: `f`, // File
            s: previousPage.s,
            y: previousPage.y,
            p: previousPage.p,
            c: previousPage.c,
            i: index.toString()
         };

         const button = { text: `${index + 1}`, callback_data: JSON.stringify(callback) };

         if (index % 4 === 0)
         {
            keyboard.push([button]);
         } else
         {
            keyboard[keyboard.length - 1].push(button);
         }
      });

      keyboard.push([{ text: "⬅️ Go Back", callback_data: JSON.stringify({ a: "lec", s: previousPage.s, y: previousPage.y, p: previousPage.p }) }]);
      return await ctx.editMessageText(text, { parse_mode: "Markdown", reply_markup: { inline_keyboard: keyboard } });

   } catch (error)
   {
      await ctx.reply(`${error}`);
      console.log(`${error}`);
   }
};

export const ShowFileInformation = async (ctx: MyContext, fileInformation: IFileData) =>
{
   try
   {
      const courseFile: CourseFile = await GetFileByIndex(fileInformation);
      const baseCallback: IFileData = {
         a: "f",
         p: fileInformation.p,
         y: fileInformation.y,
         s: fileInformation.s,
         c: fileInformation.c,
         i: fileInformation.i
      };

      const keyboard: InlineKeyboardButton[][] = [
         [
            {
               text: "✨",
               callback_data: JSON.stringify({ ...baseCallback, pa: FileProcessAction.Summary })
            },
            {
               text: "✍",
               callback_data: JSON.stringify({ ...baseCallback, pa: FileProcessAction.Quiz })
            },
            {
               text: "🔖",
               callback_data: JSON.stringify({ ...baseCallback, pa: FileProcessAction.Bookmark })
            }
         ]
      ];

      const docInfo = `${courseFile.fileName} 📥`;
      await ctx.sendDocument(courseFile.file_id, {
         caption: `${docInfo}`,
         parse_mode: "Markdown",
         reply_markup: {
            inline_keyboard: keyboard
         }
      });
   } catch (error)
   {
      console.log(error);
   }
};