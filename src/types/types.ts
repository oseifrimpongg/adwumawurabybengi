import { Scenes } from 'telegraf';

interface RegistrationData
{
   firstName?: string;
   lastName?: string;
   programme?: string;
   year?: string;
}

interface MyWizardSession extends Scenes.WizardSessionData
{
   registration: RegistrationData;
}

export interface MyContext extends Scenes.WizardContext<MyWizardSession> { }
