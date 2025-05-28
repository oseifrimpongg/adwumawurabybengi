import { Context } from "telegraf";
import User from "../models/User";
import { ICallbackData, LearningMaterial } from "../types/callbackTypes";
import { GenerateCallback } from "../utils/GenerateCallback";
import { MyContext } from "../types/types";
import path from "path";
import fs from "fs";
import { Course } from "../types/courseMaterialTypes";

export const ShowSemesters = async (ctx: Context) =>
{
   const userData = await User.findOne({ telegramId: ctx.chat?.id });
   const requestedData = ["Course Materials 📙", "Past Questions 🯄"].filter(input => input == ctx.text)[0];

   return await ctx.reply(
      `Welcome to your ${requestedData}, go ahead and choose a semester below:`,
      {
         parse_mode: "Markdown",
         reply_markup: {
            inline_keyboard: [
               [
                  { text: "First Semester", callback_data: GenerateCallback(LearningMaterial.Lecture, 1, userData) },
                  { text: "Second Semester", callback_data: GenerateCallback(LearningMaterial.Lecture, 2, userData) }
               ]
            ]
         }
      });
};


export const ShowCourses = async (ctx: MyContext, previousPage: ICallbackData) =>
{
   const { p, s, y, pr } = previousPage;

   const programmeName: string = p == "nur" ? "nursing" : p == "eme" ? "emergency_nursing" : "midwifery";
   const semester: string = s == 1 ? "first_semester" : "second_semester";
   const year: string = `Year ${y}`;

   const filepath = path.join(__dirname, `../course_materials/${programmeName}/${year}/${semester}.json`);

   try
   {
      const semesterContent = fs.readFileSync(filepath).toString();
      const courses: Course[] = JSON.parse(semesterContent);

      const keyboard = courses.map(course =>
      {
         const callback: ICallbackData = {
            a: "cou",
            s,
            p,
            y,
            c: course.code,
         };

         return [{ text: course.title, callback_data: JSON.stringify(callback) }];
      });

      // TODO: callback for back button should route me to the course materials button action
      keyboard.push([{ text: "⮠ Go Back", callback_data: JSON.stringify(previousPage) }]);

      return await ctx.editMessageText("Please choose a course below:",
         { reply_markup: { inline_keyboard: keyboard }, parse_mode: "Markdown" });
   } catch (error)
   {
      console.log(`${error}`);
   }
};