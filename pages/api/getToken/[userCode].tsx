// Here is the file we want to make the Node JS Request for the user to login to.
import * as querystring from "querystring";
import * as dotenv from "dotenv";

dotenv.config();

export default function handler(req: any, res: any) {
  const userCode = req.query.userCode;

  try {
    const spotifyUrl = "https://accounts.spotify.com/api/token";

    // Generate a base64 encoded string that contains the client ID and client secret
    // The field must have the format: Authorization: Basic *<base64 encoded client_id:client_secret>*
    const buff = Buffer.from(
      process.env.SPOTIFY_CLIENT_ID + ":" + process.env.SPOTIFY_CLIENT_SECRET
    ).toString("base64");

    const getAccessToken = async () => {
      const response = await fetch(spotifyUrl, {
        method: "POST",
        headers: {
          Authorization: `Basic ${buff}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: querystring.stringify({
          grant_type: "authorization_code",
          code: userCode,
          redirect_uri: "http://localhost:3000/",
        }),
      });

      const resJson = await response.json();

      return res.status(200).json(resJson);
    };

    return getAccessToken();
  } catch (error) {
    console.log(error);
    return null;
  }
}
