export interface CourseFile
{
   fileName: string;
   fileId: string;
   type: "pdf" | "video" | "presentation";
   sizeMB: number;
}

export interface Course
{
   code: string;
   title: string;
   files: CourseFile[];
}