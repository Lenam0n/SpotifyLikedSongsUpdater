import fs from "fs";
import path from "path";

const logFilePath = path.resolve(__dirname, "../../weekly-log.json");

export interface LogCheckResult {
  lastRunDate: Date | null;
  hasFailedSongs: boolean;
}

export const checkLastRunStatus = (): LogCheckResult => {
  if (!fs.existsSync(logFilePath)) {
    console.warn(
      "⚠️ Log-Datei nicht gefunden. Wird als erster Lauf betrachtet."
    );
    return { lastRunDate: null, hasFailedSongs: false };
  }

  try {
    const logData = JSON.parse(fs.readFileSync(logFilePath, "utf-8"));
    const lastRunDate = new Date(logData.executedAt);
    const hasFailedSongs = logData.songsProcessed.some(
      (song: any) => !song.movedToPlaylist || !song.removedFromLikedSongs
    );

    return { lastRunDate, hasFailedSongs };
  } catch (error) {
    console.error("❌ Fehler beim Lesen des Logs:", error);
    return { lastRunDate: null, hasFailedSongs: false };
  }
};
