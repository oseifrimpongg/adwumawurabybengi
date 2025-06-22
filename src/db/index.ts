import mongoose from "mongoose";

export const connectDB = () =>
{
   try
   {
      mongoose.connect(process.env.MONGO_URI ?? "", {});
      mongoose.connection.once("open", () =>
      {
         console.log("Connected to database:", mongoose.connection.name);
      });

   } catch (error)
   {
      console.log(`MongoDb Error: ${error}`);
   }
};
