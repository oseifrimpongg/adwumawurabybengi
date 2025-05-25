import path from "path";
import dotenv from "dotenv";
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Libraries
import express, { Application } from "express";
import { Scenes, session, Telegraf } from "telegraf";

import { channelSubscription } from "./middleware/channelSubscription";
import { startCommand } from "./commands/start";

// @ts-ignore importing registration js module
import registrationWizard = require('./scenes/registration.js/index.js');

import { MyContext } from "./types/types";

// Environment Setup
const app: Application = express();
const port = process.env.PORT;
const bot = new Telegraf<MyContext>(process.env.BOT_TOKEN ?? "");

const stage = new Scenes.Stage<MyContext>();
stage.register(registrationWizard);

// Telegraf Context Middleware
bot.use(session());
bot.use(channelSubscription);
bot.use(stage.middleware());
bot.start(startCommand);
bot.command('register', (ctx) => ctx.scene.enter('registration-wizard'));


// Bot launch
bot.launch();
app.listen(port, () => console.log(`Server is running on ${port}`));