const TelegramBot = require('node-telegram-bot-api');

// Replace this with your bot token from BotFather
const token = '7769993525:AAEr3Mt3VXFJvBjRnj2fFxWfJbskj5Q1zEQ';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

let userScores = {}; // Store users' scores in an object (userID: score)
let boostData = {}; // Temporary storage for boost-related information

// Set commands for the bot menu
bot.setMyCommands([
  { command: '/menu', description: 'Show the main menu' },
  { command: '/start', description: '' }
]);

// Handle '/start' command
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "Welcome to the TRON Tap Game! Use /menu to see the main options.");
});

// Main menu with buttons
bot.onText(/\/menu/, (msg) => {
  const chatId = msg.chat.id;

  const menuOptions = {
    reply_markup: {
      inline_keyboard: [
        [{ text: "Start Game", callback_data: 'start_game' }],
        [{ text: "Join Our Community", url: 'https://t.me/tronstellar' }],
        [{ text: "TRX on Stellar", url: 'https://lobstr.co/trade/TRX:GB6THAWGC4UYKOXBHEAWUQBTM4KSTIVRG6G5XMZABVOUQNRUIPW6V3DC' }], // New TRX on Stellar button
        [{ text: "Game instructions", callback_data: 'help' }]
      ]
    }
  };

  bot.sendMessage(chatId, "Start your journey with TRON Network:", menuOptions);
});

// Handle callback queries for each menu button
bot.on('callback_query', (callbackQuery) => {
  const msg = callbackQuery.message;
  const chatId = msg.chat.id;
  const userId = callbackQuery.from.id;

  switch (callbackQuery.data) {
    case 'start_game':
      // Send message with button to launch mini app after user clicks "Start Game"
      const gameOptions = {
        reply_markup: {
          inline_keyboard: [
            [{
              text: "Launch TRON Game",
              web_app: { url: 'https://tronsun1990.github.io/tron-game-bot/' } // Link to mini app
            }]
          ]
        }
      };
      bot.sendMessage(chatId, "Click the button below to launch the TRON Tap Game:", gameOptions);
      break;

    case 'help':
      bot.sendMessage(chatId, `
        Bot instructions:
        - Tap the button to earn TRX.
        - Activate your boost for x25 rewards every 12 hours.
        - Check your score and our channel daily.
        - Learn more about rewards in our Telegram.
      `);
      break;

    default:
      bot.sendMessage(chatId, "Unknown option.");
  }
});

// Example logic to increment score (connected to your tap game logic)
bot.onText(/\/tap/, (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  // Initialize user score if it doesn't exist
  if (!userScores[userId]) {
    userScores[userId] = 0;
  }

  // Increment the user's score
  userScores[userId] += 1;

  // Send updated score to the user
  bot.sendMessage(chatId, `You tapped! Your score is now: ${userScores[userId]} TRX`);
});

// Start listening for messages
console.log('Bot is running...');
