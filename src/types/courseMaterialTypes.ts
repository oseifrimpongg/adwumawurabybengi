export interface CourseFile
{
   fileName: string;
   file_id: string;
   type: string;
   sizeMB: number;
}

export interface Course
{
   title: string;
   code: string;
   files: CourseFile[];
}