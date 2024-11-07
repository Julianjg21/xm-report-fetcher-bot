// src/config/dotenvConfig.js
import dotenv from "dotenv";
import path from "path";

//Configure dotenv to load environment variables
const dotenvConfig = () => {
  dotenv.config({ path: path.resolve("./configs.env") });
  dotenv.config();
};

export default dotenvConfig;
