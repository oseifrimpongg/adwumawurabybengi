import { ICallbackData, IFileData } from "../types/callbackTypes";
import { Course, CourseFile } from "../types/courseMaterialTypes";
import Slide, { ISlideDocument } from "./models/Slide";

export const GetCourses = async (courseInformation: ICallbackData): Promise<Course[]> =>
{
   const programme = courseInformation.p.toLowerCase() === "nur"
      ? "Nursing"
      : courseInformation.p.toLowerCase() === "eme"
         ? "Emergency Nursing"
         : "Midwifery";

   const { y: year, s: semester } = courseInformation;

   const results = await Slide.aggregate([
      {
         $match: { programme, year, semester }
      },
      {
         $group: {
            _id: {
               code: "$course_code",
               title: "$course"
            }
         }
      },
      {
         $project: {
            _id: 0,
            code: "$_id.code",
            title: "$_id.title",
            files: []
         }
      },
      {
         $sort: { title: 1 }
      }
   ]);

   return results as Course[];
};

export const GetFiles = async (courseInformation: ICallbackData): Promise<Course[]> =>
{
   const { p, y: year, s: semester, c: course_code } = courseInformation;

   const programme = courseInformation.p.toLowerCase() === "nur"
      ? "Nursing"
      : p.toLowerCase() === "eme"
         ? "Emergency Nursing"
         : "Midwifery";

   const slides = await Slide.find({
      programme,
      year,
      semester,
      course_code
   });

   const courseFiles: CourseFile[] = slides.map(file => ({
      fileName: file.fileName,
      file_id: file.file_id,
      type: file.type,
      sizeMB: Math.round(file.sizeMB / 1024 / 1024)
   }));

   return [
      {
         title: slides[0]?.course ?? "Unknown Course",
         code: course_code ?? "",
         files: courseFiles
      }
   ];
};

export const GetFileByIndex = async (fileInformation: IFileData): Promise<CourseFile> =>
{
   const { p, y: year, s: semester, c: course_code, i: fi } = fileInformation;

   const programme = fileInformation.p.toLowerCase() === "nur"
      ? "Nursing"
      : p.toLowerCase() === "eme"
         ? "Emergency Nursing"
         : "Midwifery";

   const slides = await Slide.find({
      programme,
      year,
      semester,
      course_code
   });

   const courseFile: CourseFile[] = slides.map(file => ({
      fileName: file.fileName,
      file_id: file.file_id,
      type: file.type,
      sizeMB: Math.round(file.sizeMB / 1024 / 1024)
   }));

   return courseFile[fi];
};