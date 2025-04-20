import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
import { getDocuments } from "../utils/getDocuments.mjs";

// Configuring dayjs to use timezone and UTC
dayjs.extend(utc); // Extension to handle time in UTC format
dayjs.extend(timezone); // Extension to handle specific time zones
dayjs.tz.setDefault("America/Bogota"); // Set default time zone to Bogotá, Colombia

// Map to track the current status of each user using the bot
const userStates = new Map(); // `Map` to save specific states of each user by their ID

const getDEC = async (ctx) => {
  console.log(ctx.from.first_name, " is using this bot.");
  try {
    // Get the ID of the user executing the command and save initial state
    const userId = ctx.from.id;
    userStates.set(userId, {
      waitingForInput: false, // Indicates whether the bot is waiting for user input
      command: ctx.message.text, // Store the command the user sent
    });

    const userState = userStates.get(userId);
    const typeFile =
      userState.command === "/obtener_dDEC"
        ? "informe de Despacho programado"
        : "informe de Redespacho diario";

    // Send a response message with inline buttons for date selection
    await ctx.reply(`▫️Perfecto, ¿de qué día necesitas que preparemos tu ${typeFile}?`, {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "🗓️Hoy", // Button to select current date
              callback_data: "action_today", // Identifier for the "Today" button
            },
            {
              text: "🗓️Otra fecha", // Button to select a different date
              callback_data: "action_otherDate", // Identifier for the "Other date" button
            },
          ],
        ],
      },
    });
  } catch (error) {
    await ctx.reply("🚫Ocurrió un error. Por favor, intenta de nuevo.");
  }
};

// Function to break down a date object into year, month, day, and folder parts
const procesarFecha = (fecha) => {
  return {
    year: fecha.year(), // Year of date
    month: fecha.format("MM"), // Month in two-digit format
    day: fecha.format("DD"), // Day in two-digit format
    folder: fecha.format("YYYY-MM"), // Folder in "YYYY-MM" format
  };
};

// Configuring button handlers to process "Today" and "Another Date" actions
const setupButtonHandlers = (bot) => {
  // Handles the action when user selects the "Today" button
  bot.action("action_today", async (ctx) => {
    try {
      // Get the ID and status of the user who pressed the button
      const userId = ctx.from.id;
      const userState = userStates.get(userId);

      // If user state does not exist, user has not previously used a valid command
      if (!userState) {
        await ctx.answerCbQuery(); // Respond to action so button appears pressed
        return ctx.reply(
          '🚫Por favor, primero selecciona  el documento a generar: \n/obtener_dDEC "Despacho Programado" \n/obtener_rDEC "Redespacho Diario".'
        );
      }

      // Create current date in Colombia time zone
      const colombiaDate = dayjs().tz("America/Bogota");
      const dateParts = procesarFecha(colombiaDate); // Breakdown date into specific parts
      const typeFile = //Save the new content to the file system
        userState.command === "/obtener_dDEC"
          ? "informe de Despacho programado"
          : "informe de Redespacho diario"; // Define file type based on command
      const fileName =
        userState.command === "/obtener_dDEC"
          ? `dDEC${dateParts.month}${dateParts.day}`
          : `rDEC${dateParts.month}${dateParts.day}`;
      await ctx.answerCbQuery(); // Respond to action so button appears pressed
      await ctx.reply(
        `⌛️Procesando  ${typeFile} para la fecha: ${colombiaDate.format(
          "YYYY/MM/DD"
        )}`
      );

      try {
        // Calls the function to obtain the document with selected date and report type
        await getDocuments(
          dateParts.folder,
          dateParts.day,
          dateParts.month,
          dateParts.year,
          userState.command,
          fileName
        );
        // Send file to user
        const filePath = `./${fileName}.TXT`; // Path to generated file
        await ctx.replyWithDocument({ source: filePath }); // Send file as response

        await ctx.reply(
          "Usa /start si necesitas usar nuestro menú de nuevo. Fue un gusto haberte ayudado.😎"
        );
      } catch (error) {
        if (error.code === 'ENOENT') {
          await ctx.reply(`❌ Informe no disponible. XM aún no ha publicado la información correspondiente al ${dateParts.day}/${dateParts.month}/${dateParts.year}. Te recomendamos intentarlo más tarde.
`);
        } else {
          await ctx.reply("❌ Error al procesar el documento: " + error.message);
        }
      }

      // Delete user state as operation has finished
      userStates.delete(userId);
    } catch (error) {
      // On error, log it and send error message to user
      console.error("Error en action_today:", error);
      await ctx.reply("❌ Ocurrió un error. Por favor, intenta de nuevo.");
    }
  });

  // Handle action when user selects the "Another Date" button
  bot.action("action_otherDate", async (ctx) => {
    try {
      const userId = ctx.from.id;
      const userState = userStates.get(userId);

      // Verify if user has not previously executed a command
      if (!userState) {
        await ctx.answerCbQuery();
        return ctx.reply(
          '🚫Por favor, primero selecciona  el documento a generar: \n/obtener_dDEC "Despacho Programado"  \n/obtener_rDEC "Redespacho Diario".'
        );
      }

      // Update user state to indicate it is waiting for date input
      userState.waitingForInput = true;
      userStates.set(userId, userState);

      await ctx.answerCbQuery();
      await ctx.reply(
        "▫️Por favor, ingresa la fecha en el formato AAAA/MM/DD. Ejemplo: 2024/08/03."
      );
    } catch (error) {
      console.error("Error en action_otherDate:", error);
      await ctx.reply("❌ Ocurrió un error. Por favor, intenta de nuevo.");
    }
  });

  // Handler to capture any text message, in anticipation of a specific date
  bot.on("text", async (ctx) => {
    const userId = ctx.from.id;
    const userState = userStates.get(userId);

    // Ignore text if user is not waiting for a date or message is a command
    if (!userState?.waitingForInput || ctx.message.text.startsWith("/")) {
      return;
    }

    const textoRecibido = ctx.message.text; // Capture user input text

    try {
      // Strict date format validation
      const fecha = dayjs(textoRecibido, "YYYY/MM/DD", true);

      if (!fecha.isValid()) {
        throw new Error("Formato de fecha inválido"); // Throw error if date is invalid
      }

      const dateParts = procesarFecha(fecha); // Breakdown date into parts
      const typeFile =
        userState.command === "/obtener_dDEC"
          ? "informe de Despacho programado"
          : "informe de Redespacho diario"; // Determine file type based on command
      const fileName =
        userState.command === "/obtener_dDEC"
          ? `dDEC${dateParts.month}${dateParts.day}`
          : `rDEC${dateParts.month}${dateParts.day}`;
      await ctx.reply(
        `⏳Procesando  ${typeFile} para la fecha: ${textoRecibido}`
      );

      try {
        // Call function to get document with entered date and report type
        await getDocuments(
          dateParts.folder,
          dateParts.day,
          dateParts.month,
          dateParts.year,
          userState.command,
          fileName
        );
        // Send file to user
        const filePath = `./${fileName}.TXT`; // Path to generated file
        await ctx.replyWithDocument({ source: filePath }); // Send file as response

        await ctx.reply(
          "Usa /start si necesitas usar nuestro menú de nuevo. Fue un gusto haberte ayudado.😎"
        );
      } catch (error) {
        if (error.code === 'ENOENT') {
          await ctx.reply(`❌ Informe no disponible. XM aún no ha publicado la información correspondiente al ${dateParts.day}/${dateParts.month}/${dateParts.year}. Te recomendamos intentarlo más tarde.
`);
        } else {
          await ctx.reply("❌ Error al procesar el documento: " + error.message);
        }
      }

      // Delete user state as operation has finished
      userStates.delete(userId);
    } catch (error) {
      // On date error, inform user and show example of correct format
      console.error("Error procesando fecha:", error);
      await ctx.reply(
        "❌ Error: Formato de fecha incorrecto. Por favor, usa el formato AAAA/MM/DD. (ejemplo: 2024/08/03)"
      );
    }
  });
};

export { getDEC, setupButtonHandlers };
