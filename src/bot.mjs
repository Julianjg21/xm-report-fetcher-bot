import { Telegraf } from "telegraf";
import dotenvConfig from "./configs/dotenvConfig.mjs";
import helpCommand from "./comands/help.mjs";
import startCommand from "./comands/start.mjs";
import textHandler from "./events/textHandler.mjs";
import { getDEC, setupButtonHandlers } from "./comands/getDEC.mjs";
//Configuring dotenv to use enviroment variables
dotenvConfig();

//initialize the bot using the token enviroment variables
const bot = new Telegraf(process.env.BOT_TOKEN);

//bot commands
bot.command("obtener_dDEC", getDEC);
bot.command("obtener_rDEC", getDEC);
bot.command("help", helpCommand);
bot.command("start", startCommand);

//Configure button handlers
setupButtonHandlers(bot);

//Defines the handler for text messages other than commands
bot.on("text", textHandler);

//Start the bot and wait for messages
bot.launch().then(() => console.log("Bot iniciado"));

//Handles the termination of the process in case of receiving closure signals
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
