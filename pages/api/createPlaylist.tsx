import * as querystring from "querystring";

export default function handler(req: any, res: any) {
  try {
    const user_id = req.query.user_id;
    const access_token = req.query.access_token;

    const ENDPOINT = `https://api.spotify.com/v1/users/${user_id}/playlists`;

    const createPlaylist = async () => {
      const response = await fetch(ENDPOINT, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify({
          name: "Cool Expando Playlist",
          public: "false",
          collaborative: "false",
          description: "A cool playlist created by Expando feature",
        }),
      });

      const resJson = await response.json();

      return res.status(200).json(resJson);
    };

    return createPlaylist();
  } catch (error) {
    console.error("Error Occurred Creating Playlist", error);
    return res.status(400);
  }
}
