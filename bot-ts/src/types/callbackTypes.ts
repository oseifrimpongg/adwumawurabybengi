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

export interface IFileData extends ICallbackData
{
   fileId: string;
}