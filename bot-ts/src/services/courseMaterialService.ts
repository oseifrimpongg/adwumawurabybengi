import fs from "fs";
import path from "path";
import User from "../models/User";
import { Context } from "telegraf";
import { MyContext } from "../types/types";
import { GenerateCallback } from "../utils/GenerateCallback";
import { Course, CourseFile } from "../types/courseMaterialTypes";
import { InlineKeyboardButton } from "telegraf/typings/core/types/typegram";
import { ICallbackData, IFileData, LearningMaterial } from "../types/callbackTypes";


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
   const filepath = GetCourseFile(previousPage);

   try
   {
      const semesterContent = fs.readFileSync(filepath).toString();
      const courses: Course[] = JSON.parse(semesterContent);

      const keyboard = courses.map(course =>
      {
         const callback: ICallbackData = {
            a: "cou",
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
   const filepath = GetCourseFile(previousPage);

   try
   {
      const semesterContent = fs.readFileSync(filepath).toString();
      const courses: Course[] = JSON.parse(semesterContent);
      const courseFiles = courses.filter(course => course.code == previousPage.c)[0];

      let text = `You chose *${courseFiles.title}*. \nPlease choose a file below:\n\n`;
      text += courseFiles.files.map((courseFile, index) => `*${index + 1}* ${courseFile.fileName}`).join("\n");

      const keyboard: any[][] = [];

      courseFiles.files.forEach((courseFile, index) =>
      {
         const callback: IFileData = {
            a: `file`,
            s: previousPage.s,
            y: previousPage.y,
            p: previousPage.p,
            c: previousPage.c,
            fileId: courseFile.fileId
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
   const filepath = GetCourseFile(fileInformation);

   try
   {
      const semesterContent = fs.readFileSync(filepath).toString();
      const courses: Course[] = JSON.parse(semesterContent);
      const courseFile: CourseFile = courses.filter(course => course.code == fileInformation.c)[0].files.filter(file => file.fileId == fileInformation.fileId)[0];

      const keyboard: InlineKeyboardButton[][] = [
         [{ text: "✨", callback_data: "sum" },
         { text: "✍", callback_data: "quiz" },
         { text: "🔖", callback_data: "bookmark" },]
      ];

      const docInfo = `${courseFile.fileName} 📥`;
      await ctx.sendDocument("https://csbible.com/wp-content/uploads/2018/03/CSB_Pew_Bible_2nd_Printing.pdf", { caption: `${docInfo}`, parse_mode: "Markdown", reply_markup: { inline_keyboard: keyboard } });
   } catch (error)
   {
      console.log(error);
   }
};


function GetCourseFile(fileInformation: ICallbackData): string
{
   const { p, s, y } = fileInformation;
   const programmeName: string = p == "nur" ? "nursing" : p == "eme" ? "emergency_nursing" : "midwifery";
   const semester: string = s == 1 ? "first_semester" : "second_semester";
   const year: string = `Year ${y}`;

   return path.join(__dirname, `../course_materials/${programmeName}/${year}/${semester}.json`);
}