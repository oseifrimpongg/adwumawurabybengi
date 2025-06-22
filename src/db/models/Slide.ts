import mongoose, { Document, Schema } from "mongoose";
export interface ISlideDocument extends Document
{
   programme: string;
   year: number;
   semester: number;
   course: string;
   course_code: string,
   fileName: string;
   file_id: string;
   type: string;
   sizeMB: number;
}

const SlideSchema = new Schema<ISlideDocument>({
   programme: { type: String, required: true },
   year: { type: Number, required: true },
   semester: { type: Number, required: true },
   course: { type: String, required: true },
   course_code: { type: String, required: true },
   fileName: { type: String, required: true },
   file_id: { type: String, required: true },
   type: { type: String, required: true },
   sizeMB: { type: Number, required: true }
});

SlideSchema.index({ programme: 1, year: 1, semester: 1 });

const Slide = mongoose.model<ISlideDocument>("Slide", SlideSchema, "Slides");
export default Slide;
