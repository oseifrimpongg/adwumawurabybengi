export interface ICallbackData
{
   a: string,
   p: string;
   y: number,
   s: number,
   c?: string;
   pr?: ICallbackData | null;
}

export enum LearningMaterial
{
   Lecture,
   Past_Questions
}

export enum FileProcessAction
{
   Summary = "s",
   Quiz = "q",
   Bookmark = "b"
}
export interface IFileData extends ICallbackData
{
   i: string;
   pa?: FileProcessAction;
}