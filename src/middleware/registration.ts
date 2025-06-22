import { NextFunction } from "express";
import { MyContext } from "../types/types";
import User from "../db/models/User";

export const registrationCheck = async (ctx: MyContext, next: NextFunction) =>
{
   if (!ctx.from) return;

   const telegramId = ctx.from.id;
   const user = await User.findOne({ telegramId });

   if (!user && ctx.scene.current?.id !== 'registration-wizard')
   {
      return ctx.scene.enter('registration-wizard');
   }

   return next();
};
