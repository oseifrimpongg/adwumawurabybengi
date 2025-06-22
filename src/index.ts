// Setup Environment and variables
import path from "path";
import dotenv from "dotenv";
// dotenv.config({ path: path.resolve(__dirname, "../.env") });
dotenv.config();

// Libraries
import express, { Application } from "express";
import { Scenes, session, Telegraf } from "telegraf";

import { channelSubscription } from "./middleware/channelSubscription";
import { StartCommand } from "./commands/start";

// Scenes
import { registrationWizard } from "./scenes/registrationScene";

import { MyContext } from "./types/types";
import { connectDB } from "./db/index";
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

// Server
app.use(bot.webhookCallback("/"));
app.use(express.json());

// Middleware
bot.use(session());
bot.use(channelSubscription);
bot.use(stage.middleware());
bot.use(registrationCheck);

// Commands & Intercepts
bot.start(StartCommand);
bot.on("message", InterceptTextMessage);
bot.on("callback_query", InterceptCallback);

// Bot launch
bot.telegram.setWebhook(process.env.RepoService ?? "");
app.listen(port, () => console.log(`Server is running on ${port}`));

/*
TODO: Make preparations for users that block the bot and make them unable to use the service after some time cause chale, you can't come and give me pressure in my own service.
*/