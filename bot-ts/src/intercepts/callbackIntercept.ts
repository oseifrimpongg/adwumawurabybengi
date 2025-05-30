import { ShowCourses, ShowFiles, ShowSemesters } from "../services/courseMaterialService";
import { ICallbackData } from "../types/callbackTypes";
import { MyContext } from "../types/types";

const callbackRoutes: [RegExp, (ctx: MyContext, previousPage: ICallbackData) => void][] = [
   [/^\{"a":"lsem","s":\d+,"y":\d+,"p":"[A-Za-z]{3}"\}$/, ShowSemesters],
   [/^\{"a":"lec","s":\d+,"y":\d+,"p":"[A-Za-z]{3}"\}$/, ShowCourses],
   [/^\{"a":"cou","s":\d+,"p":"[A-Za-z]+","y":\d+,"c":"[A-Za-z0-9_]+\"\}$/, ShowFiles]
];

export const InterceptCallback = async (ctx: MyContext) =>
{
   const callback = ctx.callbackQuery;
   if (!(callback == undefined) && !("data" in callback) || callback == undefined) return;

   const callbackData: ICallbackData = JSON.parse(callback.data);
   const callbackAsString: string = JSON.stringify(callbackData);

   for (const [regex, route] of callbackRoutes)
   {
      if (regex.test(callbackAsString))
      {
         await route(ctx, callbackData);
         return;
      };
   }
};