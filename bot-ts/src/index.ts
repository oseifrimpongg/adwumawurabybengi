// Setup Environment and variables
import path from "path";
import dotenv from "dotenv";
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Libraries
import express, { Application } from "express";
import { Scenes, session, Telegraf } from "telegraf";

import { channelSubscription } from "./middleware/channelSubscription";
import { StartCommand } from "./commands/start";

// Scenes
import { registrationWizard } from "./scenes/registrationScene";

import { MyContext } from "./types/types";
import { connectDB } from "./db/db";
import { registrationCheck } from "./middleware/registration";
import { InterceptTextMessage } from "./intercepts/messageIntercept";
import { InterceptCallback } from "./intercepts/callbackIntercept";

// Database Connection
connectDB();

// Environment Setup
const app: Application = express();
const port = process.env.PORT;
const bot = new Telegraf<MyContext>(process.env.BOT_TOKEN ?? "");

const stage = new Scenes.Stage<MyContext>();
stage.register(registrationWizard);

// Middleware
bot.use(session());
bot.use(channelSubscription);
bot.use(stage.middleware());
bot.use(registrationCheck);

// Commands
bot.start(StartCommand);
bot.on("message", InterceptTextMessage);
bot.on("callback_query", InterceptCallback);

// Bot launch
bot.telegram.setWebhook(process.env.RepoService ?? "");
app.listen(port, () => console.log(`Server is running on ${port}`));