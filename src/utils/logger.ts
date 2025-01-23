import fs from "fs";
import path from "path";
import { months, logDirectory } from "./globalVariabeln";

interface SongLogEntry {
  name: string;
  artist: string;
  addedAt: string;
  movedToPlaylist: boolean;
  removedFromLikedSongs: boolean;
}

interface WeeklyLog {
  executedAt: string;
  finishedAt?: string;
  songsProcessed: SongLogEntry[];
  success: boolean;
}

export const logWeeklyRun = (logData: WeeklyLog): void => {
  const executedDate = new Date(logData.executedAt);
  const day = String(executedDate.getDate()).padStart(2, "0");
  const month = months[executedDate.getMonth()];
  const year = executedDate.getFullYear();

  const logFileName = `weekly-log_${day}_${month}_${year}.json`;
  const logFilePath = path.join(logDirectory, logFileName);

  try {
    if (!fs.existsSync(logDirectory)) {
      fs.mkdirSync(logDirectory, { recursive: true });
    }

    fs.writeFileSync(logFilePath, JSON.stringify(logData, null, 2));
    console.log(`✅ Log erfolgreich gespeichert in ${logFileName}`);
  } catch (error) {
    console.error("❌ Fehler beim Speichern des Logs:", error);
  }
};
