import { Context } from "telegraf";
import { FileProcessAction, IFileData } from "../types/callbackTypes";
import { SummaryService } from "./FileProcessServices/SummaryService";
import { QuizService } from "./FileProcessServices/QuizServices";
import { BookmarkService } from "./FileProcessServices/BookmarkService";

export const HandleFileProcessing = async (ctx: Context, callback: IFileData) =>
{
   switch (callback.pa)
   {
      case FileProcessAction.Summary:
         return SummaryService(ctx);

      case FileProcessAction.Quiz:
         return QuizService(ctx);

      case FileProcessAction.Bookmark:
         return BookmarkService(ctx);

      default:
         return ctx.reply("Unrecognized file processing action.");
   }
};
