// src/commands/help.js

const helpCommand = (ctx) => {
//Displays the list of available commands
  ctx.reply(`
    Aquí tienes los comandos disponibles:
    /start - Inicia el bot
    /help - Muestra esta lista de comandos
    /obtener_dDEC - Generar informe de Despacho Programado
    /obtener_rDEC - Genera informe de Redespacho Diario
  `);
};

export default helpCommand;
