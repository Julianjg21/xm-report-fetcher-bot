// src/commands/start.js

const startCommand = (ctx) => {
  //Displays the personalized welcome message with the user's name
  ctx.reply(
    `¡Hola, ${ctx.from.first_name}! Bienvenido al bot de informes de despacho. Usa /help para ver los comandos disponibles.`
  );
};

export default startCommand;
