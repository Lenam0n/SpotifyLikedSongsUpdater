import { setupSpotifyApi } from "./spotifyApi";
import { getConfig } from "./config";
import { months } from "./globalVariabeln";

const manageOldLikedSongs = async (): Promise<void> => {
  const { appConfig, spotifyConfig } = getConfig();
  const spotifyApi = setupSpotifyApi(spotifyConfig);
  await spotifyApi.refreshAccessToken();

  const likedSongs = await spotifyApi.getMySavedTracks({ limit: 50 });
  const thresholdDate = new Date();
  thresholdDate.setMonth(
    thresholdDate.getMonth() - appConfig.songAgeThresholdMonths
  );

  const songsByMonth: Record<string, string[]> = {};

  likedSongs.body.items.forEach((item) => {
    const addedDate = new Date(item.added_at);
    if (addedDate < thresholdDate) {
      const monthYearKey = `${
        months[addedDate.getMonth()]
      } ${addedDate.getFullYear()}`;
      if (!songsByMonth[monthYearKey]) {
        songsByMonth[monthYearKey] = [];
      }
      songsByMonth[monthYearKey].push(item.track.uri);
    }
  });

  for (const [monthYear, trackUris] of Object.entries(songsByMonth)) {
    const playlistName = `${appConfig.playlistPrefix} - ${monthYear}`;
    const playlist = await spotifyApi.createPlaylist(playlistName, {
      public: false,
    });
    await spotifyApi.addTracksToPlaylist(playlist.body.id, trackUris);
  }
};

(async () => {
  await manageOldLikedSongs();
})();
