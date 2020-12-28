// Here is the file we want to make the Node JS Request for the user to login to.
import * as querystring from "querystring";

export default function handler(req: any, res: any) {
  // Here is where we need to make a request to
  // The /authorize endpoint from spotify
  // We'll need to pass it the :
  // - client_id, response_type, redirect_uri, state, scope, show_dialog

  try {
    const scope =
      "user-read-private user-read-email playlist-read-private playlist-read-collaborative user-read-currently-playing user-top-read";

    const spotifyUrl =
      "https://accounts.spotify.com/authorize?" +
      querystring.stringify({
        client_id: "406b705ff93f4b619a6f9add5c4a898c",
        response_type: "code",
        redirect_uri: "http://localhost:3000/",
        //state: state,
        scope: scope,
        show_dialog: false,
      });

    console.log(spotifyUrl);

    res.status(200).json({ url: spotifyUrl });
  } catch (error) {
    console.log(error);
  }
}
