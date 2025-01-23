import SpotifyWebApi from "spotify-web-api-node";
import dotenv from "dotenv";

dotenv.config();

export const setupSpotifyApi = (config: {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
}) => {
  const spotifyApi = new SpotifyWebApi({
    clientId: config.clientId,
    clientSecret: config.clientSecret,
  });
  spotifyApi.setRefreshToken(config.refreshToken);
  return spotifyApi;
};

export const refreshAccessToken = async (
  spotifyApi: SpotifyWebApi
): Promise<void> => {
  const data = await spotifyApi.refreshAccessToken();
  spotifyApi.setAccessToken(data.body.access_token);
};
