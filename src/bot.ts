import { exec } from "child_process";
import { Bot } from "grammy";
require('dotenv').config()

// Create an instance of the `Bot` class and pass your authentication token to it.
const bot = new Bot(`${process.env.BOT_TOKEN}`);


// You can now register listeners on your bot object `bot`.
// grammY will call the listeners when users send messages to your bot.

// Handle the /start command.
bot.command("start", (ctx) => ctx.reply("Welcome! Up and running."));
// Handle other messages.
bot.on("message", async (ctx) => {
    await ctx.reply("Message received. \nRunning automation tests");
    await exec("npx playwright test --headed", (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
        ctx.reply("Tests finished");
    });
});

// Now that you specified how to handle messages, you can start your bot.
// This will connect to the Telegram servers and wait for messages.

// Start the bot.
bot.start();