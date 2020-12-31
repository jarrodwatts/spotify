export default function handler(req: any, res: any) {
  try {
    console.log("Auery:", req.query);
    const playlist_id = req.query.playlist_id;
    const access_token = req.query.access_token;
    const tracks = req.query.tracks;

    console.log("Acces token is:", access_token);

    const ENDPOINT = `https://api.spotify.com/v1/playlists/${playlist_id}/tracks?uris=${tracks}`;

    const addTracksToPlaylist = async () => {
      const response = await fetch(ENDPOINT, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-type": "application/json",
        },
      });

      const resJson = await response.json();

      return res.status(200).json(resJson);
    };

    return addTracksToPlaylist();
  } catch (error) {
    console.error("Error Occurred Creating Playlist", error);
    return res.status(400);
  }
}
