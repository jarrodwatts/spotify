import * as querystring from "querystring";

export default function handler(req: any, res: any) {
  try {
    const access_token = req.query.accessToken;

    const TOP_TRACKS_ENDPOINT = `https://api.spotify.com/v1/me/top/tracks`;

    const getData = async () => {
      const trackData = await fetch(TOP_TRACKS_ENDPOINT, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      const { items } = await trackData.json();

      if (items) {
        return res.status(200).json(items);
      } else {
        if (trackData.status === 401) {
          console.log(
            "Unauthorized Response Recieved From Spotify. Access Token Likely Expired."
          );
          // Return a 401 response
          return res.status(200).json({ status: 401 });
        }
      }
    };
    return getData();
  } catch (error) {
    console.error("Error Occurred Getting Top Songs:", error);
    return res.status(400);
  }
}
