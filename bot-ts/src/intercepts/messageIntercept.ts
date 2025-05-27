import { ShowSemesters } from "../services/coursematerialservice";
import { MyContext } from "../types/types";

const messageRoutes = {
   "Course Materials 📙": ShowSemesters
} as const;

export const InterceptTextMessage = (ctx: MyContext) =>
{
   const inputText: string = ctx.text != undefined ? ctx.text : "Invalid";
   const inputHandler = messageRoutes[inputText as keyof typeof messageRoutes];
   if (inputHandler) return inputHandler(ctx);
};