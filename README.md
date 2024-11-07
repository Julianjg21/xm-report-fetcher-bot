# XM Report Fetcher Bot

**XM REPORT FETCHER** es un bot de Telegram diseñado para obtener y descargar informes de despacho y redespacho proporcionados por XM en Colombia mediante peticiones HTTP directas. Este bot, desarrollado en _Node.js_, utiliza axios para realizar las solicitudes y acceder a los datos de forma eficiente.

## Tabla de Contenidos

- [Funcionalidades](#funcionalidades)
- [Dependencias](#dependencias)
- [Comandos Disponibles](#comandos-disponibles)
- [Prueba el Bot](#prueba-el-bot)

---

### Funcionalidades

-Descarga rápida de informes de despacho y redespacho mediante axios.
-Comandos de fácil acceso en Telegram.
-Actualización de datos mediante peticiones HTTP.

### Dependencias

El bot utiliza las siguientes dependencias para su funcionamiento:

**Paquete Descripción**

- axios Realiza peticiones HTTP para obtener los datos de los informes.
- dayjs Manejo de fechas y horas.
- dotenv Carga de variables de entorno desde .env.
- telegraf Framework para crear bots en Telegram.
- nodemon Reinicio automático en cada cambio del código (devDependency).

### Scripts

**Comando Descripción**

- npm start Ejecuta el bot en modo producción.
- npm run dev Ejecuta el bot en modo desarrollo con nodemon.

### Comandos Disponibles

En Telegram, puedes interactuar con el bot mediante los siguientes comandos:

- /start - Inicia el bot
- /help - Muestra esta lista de comandos
- /obtener_dDEC - Generar informe de Despacho Programado
- /obtener_rDEC - Genera informe de Redespacho Diario

### Prueba el Bot

Para probar el bot de Telegram, utiliza el siguiente enlace: https://t.me/dsProgramadobot
