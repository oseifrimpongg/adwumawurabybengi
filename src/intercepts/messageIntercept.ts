import { InitiateChat } from "../services/ChatService";
import { ShowSemesters } from "../services/CourseMaterialService";
import { ShowPastQuestions } from "../services/PastQuestionsService";
import { MyContext } from "../types/types";

const messageRoutes = {
   "Course Materials 📙": ShowSemesters,
   "Past Questions 📖": ShowPastQuestions,
   "AI Chat 🤖": InitiateChat
} as const;

export const InterceptTextMessage = (ctx: MyContext) =>
{
   const inputText: string = ctx.text != undefined ? ctx.text : "Invalid";
   const inputHandler = messageRoutes[inputText as keyof typeof messageRoutes];
   if (inputHandler) return inputHandler(ctx);
};