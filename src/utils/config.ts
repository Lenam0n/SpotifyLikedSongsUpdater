import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

interface AppConfig {
  triggerWeekly: boolean;
  playlistPrefix: string;
  songAgeThresholdMonths: number;
}

const defaultConfig: AppConfig = {
  triggerWeekly: false,
  playlistPrefix: "Liked Songs",
  songAgeThresholdMonths: 6,
};

export const getConfig = (): {
  appConfig: AppConfig;
  spotifyConfig: {
    clientId: string;
    clientSecret: string;
    refreshToken: string;
  };
} => {
  let appConfig: AppConfig = { ...defaultConfig };

  const configPath = path.resolve(__dirname, "../../app-config.json");
  if (fs.existsSync(configPath)) {
    try {
      const fileContent = fs.readFileSync(configPath, "utf-8");
      const parsedConfig = JSON.parse(fileContent);
      appConfig = { ...defaultConfig, ...parsedConfig };
    } catch (error) {
      console.error("Fehler beim Laden der Konfigurationsdatei:", error);
    }
  } else {
    console.warn(
      "app-config.json nicht gefunden. Es werden Standardwerte verwendet."
    );
  }

  return {
    appConfig,
    spotifyConfig: {
      clientId: process.env.SPOTIFY_CLIENT_ID || "",
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET || "",
      refreshToken: process.env.SPOTIFY_REFRESH_TOKEN || "",
    },
  };
};
