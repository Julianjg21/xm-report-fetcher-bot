import axios from "axios";
import fs from "fs";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";

//Configure dayjs to handle time zones and UTC
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("America/Bogota"); // Zona horaria de Bogotá, Colombia

//Function to get documents
export const getDocuments = async (
  folder,
  day,
  month,
  year,
  command,
  fileName
) => {
  const typeFile = command === "/obtener_dDEC" ? "DESPACHO" : "Redespacho";

  try {
    //Get the download link
    const {
      data: { url },
    } = await axios.get(
      `https://app-portalxmcore01.azurewebsites.net/administracion-archivos/ficheros/descarga-archivo?ruta=M:/InformacionAgentes/Usuarios/Publico/${typeFile}/${folder}/${fileName}.txt&nombreBlobContainer=storageportalxm`
    );

    //Download the file as buffer
    const responseFile = await axios.get(url, {
      responseType: "arraybuffer",
    });

    //Convert buffer to string
    let fileContent = Buffer.from(responseFile.data, "binary").toString(
      "utf-8"
    );

    //Regular expression to extract matching data
    const regex = /("ZIPA[^"]*")[,\d]*/gm;
    const extractedData = fileContent.match(regex) || [];

    //Document name
    const fileTitule =
      command === "/obtener_dDEC"
        ? "Informe de Despacho Programado"
        : "Informe de Redespacho Diario";

    //Get the current date and time in Bogotá, Colombia
    const colombiaDate = dayjs()
      .tz("America/Bogota")
      .format("DD/MM/YYYY HH:mm:ss");

    //Create the new content
    const newContent =
      `${fileTitule.toUpperCase()}\nFecha y hora de descarga del documento: ${colombiaDate}\n\n` +
      extractedData.join("\n") +
      `\n\nNota: Los datos presentados en este documento corresponden a la fecha ${day}/${month}/${year}.`;

    //Save the new content to the file system
    fs.writeFileSync(`${fileName}.TXT`, newContent);
  } catch (error) {
    console.error("Error al descargar o manipular el archivo:", error);
  }
};

export default getDocuments;
