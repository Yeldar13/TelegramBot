const {Telegraf} = require('telegraf');
const {sum, mult, divide} = require('./handlers')
require('dotenv').config()
console.log(process.env)

const { Sequelize } = require('sequelize');



const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host:process.env.DB_HOST,
    dialect:'mysql'
});


sequelize.authenticate().then(() => {
        console.log('Connection has been established successfully.');
    }).catch(err =>{
        console.error('Unable to connect to the database:', err);
    });




const bot = new Telegraf(process.env.BOT_TOKEN);



const dataBase ={}

bot.start((ctx) => ctx.reply('Welcome Aika student!'));
bot.help((ctx) => ctx.reply('Send me a sticker'));
bot.on('sticker', (ctx) => ctx.reply('👍'));

bot.hears('hi', (ctx) => ctx.reply('Hey there'));

bot.command('profile',(ctx) => {
const chatId = ctx.chat.id;
const profile = dataBase[chatId];
if(!profile){
    ctx.reply('You have not profile');
    return;
}
    ctx.reply(`Your name is ${profile.name}, you are ${profile.age}`);
})

bot.on('text', (ctx) => {

    if (ctx.message.text.startsWith('sum')) sum(ctx)
    if (ctx.message.text.startsWith('mult')) mult(ctx)
    if (ctx.message.text.startsWith('divide')) divide(ctx)

     if(ctx.message.text.startsWith('/name')){
     const message = ctx.message.text.split(' ');
     const name = message[1]
     if(!dataBase[ctx.chat.id]) dataBase[ctx.chat.id] = {};
     dataBase[ctx.chat.id].name = name;
     ctx.reply(`Your name is ${name}`);
}
    if(ctx.message.text.startsWith('/age')) {
        const message = ctx.message.text.split(' ');
        const age = message[1]
        if (!dataBase[ctx.chat.id]) dataBase[ctx.chat.id] = {};
        dataBase[ctx.chat.id].age = age;
        ctx.reply(`Your age is ${age}`);
    }


    console.log(dataBase)

});

bot.launch().then(() => console.log('Bot started'));

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'))