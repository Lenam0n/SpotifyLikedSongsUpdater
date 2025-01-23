import SpotifyWebApi from "spotify-web-api-node";
import { refreshAccessToken } from "./spotifyApi";
import { logWeeklyRun } from "./logger";
import { months } from "./globalVariabeln";

export const manageWeeklyLikedSongs = async (
  spotifyApi: SpotifyWebApi,
  playlistPrefix: string
): Promise<void> => {
  await refreshAccessToken(spotifyApi);
  const likedSongs = await spotifyApi.getMySavedTracks({ limit: 50 });

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const monthYearKey = `${
    months[oneWeekAgo.getMonth()]
  } ${oneWeekAgo.getFullYear()}`;

  const weeklySongs = likedSongs.body.items.filter(
    (item) => new Date(item.added_at) < oneWeekAgo
  );

  if (weeklySongs.length === 0) {
    console.log("ℹ️ Keine Songs zum Verarbeiten.");
    return;
  }

  const playlistName = `${playlistPrefix} - ${monthYearKey}`;
  const playlist = await spotifyApi.createPlaylist(playlistName, {
    public: false,
  });

  const songLogs = [];

  for (const song of weeklySongs) {
    const track = song.track;
    const songLogEntry = {
      name: track.name,
      artist: track.artists.map((a) => a.name).join(", "),
      addedAt: song.added_at,
      movedToPlaylist: false,
      removedFromLikedSongs: false,
    };

    try {
      await spotifyApi.addTracksToPlaylist(playlist.body.id, [track.uri]);
      songLogEntry.movedToPlaylist = true;
    } catch (error) {
      console.error(`❌ Fehler beim Hinzufügen von ${track.name}:`, error);
    }

    try {
      await spotifyApi.removeFromMySavedTracks([track.id]);
      songLogEntry.removedFromLikedSongs = true;
    } catch (error) {
      console.error(`❌ Fehler beim Entfernen von ${track.name}:`, error);
    }

    songLogs.push(songLogEntry);
  }

  const logData = {
    executedAt: new Date().toISOString(),
    finishedAt: new Date().toISOString(),
    songsProcessed: songLogs,
    success: songLogs.every(
      (log) => log.movedToPlaylist && log.removedFromLikedSongs
    ),
  };

  logWeeklyRun(logData);
};
