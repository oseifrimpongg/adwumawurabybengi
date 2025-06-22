import { Document } from "mongoose";
import { IUser } from "../db/models/User";
import { LearningMaterial, ICallbackData } from "../types/callbackTypes";

export function GenerateCallback(requestType: LearningMaterial, semester: number, data: (Document<unknown, {}, IUser, {}> & IUser & Required<{ _id: unknown; }> & { __v: number; }) | null)
{
   if (data == null) return "";

   const actionMatch = {
      [LearningMaterial.Lecture]: "lec",
      [LearningMaterial.Past_Questions]: "pas"
   };

   const returnData: ICallbackData = {
      a: actionMatch[requestType],
      s: semester,
      y: data.year,
      p: `${data?.programme.substring(0, 3)}`
   };

   return JSON.stringify(returnData);
}
