// Here is the file we want to make the Node JS Request for the user to login to.
import * as querystring from "querystring";

export default function handler(req: any, res: any) {
  const {
    query: { accessToken },
  } = req;

  console.log("Access tkoen with backend:", accessToken);

  const TOP_TRACKS_ENDPOINT = `https://api.spotify.com/v1/me/top/tracks`;

  const getData = async () => {
    const trackData = await fetch(TOP_TRACKS_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const { items } = await trackData.json();

    // console.log(items);
    return res.status(200).json(items);
  };

  return getData();
}
