// Here is the file we want to make the Node JS Request for the user to login to.
import * as querystring from "querystring";

export default function handler(req: any, res: any) {
  try {
    const scope =
      "user-read-private user-read-email playlist-read-private playlist-read-collaborative user-read-currently-playing user-top-read";

    const spotifyUrl =
      "https://accounts.spotify.com/authorize?" +
      querystring.stringify({
        client_id: process.env.SPOTIFY_CLIENT_ID,
        response_type: "code",
        redirect_uri: "http://localhost:3000/",
        //state: state,
        scope: scope,
        show_dialog: false,
      });

    // Send back the redirect url provided by the code generated above.
    res.status(200).json({ url: spotifyUrl });
  } catch (error) {
    console.error(error);
    // Send back a 400 response to indicate a bad request
    res.status(400);
  }
}
