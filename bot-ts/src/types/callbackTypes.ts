export interface ICallbackData
{
   a: string,
   s: number,
   y: number,
   p: string;
   c?: string;
   pr?: ICallbackData | null;
}

export enum LearningMaterial
{
   Lecture,
   Past_Questions
}