// src/events/textHandler.js

const textHandler = (ctx) => {
  const message = ctx.message.text;

  //Check if the message is not a command
  if (!message.startsWith("/")) {
    ctx.reply(
      `¡Hola, ${ctx.from.first_name}! Bienvenido al bot de informes de despacho. Usa /help para ver los comandos disponibles.`
    );
  }
};

export default textHandler;
