const TelegramApi = require('node-telegram-bot-api')
const {gameOptions,againOptions} = require ('./options')
const token = '2131831915:AAH-IKIu1IUazWiMob4aw8yMY8OLE6a8Puo'

const bot = new TelegramApi(token, {polling: true})

const chats = {}


const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `Сейчас я загадаю число от 0 до 9, а ты отгадай`)
    const randomNumber = Math.floor(Math.random() * 10)
    chats [chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Отгадай число', gameOptions)
}

const start = () => {

    bot.setMyCommands([
        {command:'/start', description: 'Начальное приветствие'},
        {command:'/info', description: 'Список команд'},
        {command:'/game', description: 'Игра, угадай число'}
    ])
    
    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
    
        if(text === '/start') {
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/ea5/382/ea53826d-c192-376a-b766-e5abc535f1c9/7.webp')
            return bot.sendMessage(chatId, `Добро пожаловать в бот`)
            }
        if(text === '/info') {
            return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name}`)
        }
        if(text === '/game') {
            return startGame(chatId);
            }
        return bot.sendMessage(chatId, 'Я тебя не понимаю, попробуй еще раз')
        })
        bot.on('callback_query', async msg => {
            const data = msg.data;
            const chatId = msg.message.chat.id;
            if(data === '/again') {
                return startGame(chatId)
            }
            if (data === chats [chatId]) {
                return await bot.sendMessage(chatId, `Поздравляю ты отгадал цифру ${chats [chatId]}`, againOptions)
            } else {
                return await bot.sendMessage(chatId, `Ты не угадал, бот загадал цифру ${chats [chatId]}`, againOptions)
            }
        })
}

start()