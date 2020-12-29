// Here is the file we want to make the Node JS Request for the user to login to.
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

      return res.status(200).json(items);
    };
    return getData();
  } catch (error) {
    console.error("Error Occurred Getting Top Songs:", error);
    return res.stats(400);
  }
}
