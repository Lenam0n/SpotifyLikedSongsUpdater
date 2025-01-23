import { setupSpotifyApi } from "./utils/spotifyApi";
import { manageWeeklyLikedSongs } from "./utils/playlistUtils";
import { getConfig } from "./utils/config";
import { checkLastRunStatus } from "./utils/logChecker";

(async () => {
  const { appConfig, spotifyConfig } = getConfig();
  const spotifyApi = setupSpotifyApi(spotifyConfig);
  const { lastRunDate, hasFailedSongs } = checkLastRunStatus();

  const shouldRun = appConfig.triggerWeekly || hasFailedSongs || !lastRunDate;

  if (shouldRun) {
    console.log("🔄 Starte wöchentliche Playlist-Verarbeitung...");
    await manageWeeklyLikedSongs(spotifyApi, appConfig.playlistPrefix);
  } else {
    console.log("✅ Kein neuer Lauf erforderlich.");
  }
})();
