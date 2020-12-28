import React, { useState, useEffect } from "react";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Link from "../src/Link";
import { useRouter } from "next/router";
import { access, accessSync } from "fs";

export default function Index() {
  const router = useRouter();
  const [signInUrl, setSignInUrl] = useState("");
  const [user, setUser] = useState(null);
  const [code, setCode] = useState("");
  const [accessToken, setAccessToken] = useState({});
  const [topTracks, setTopTracks] = useState([]);

  const handleSpotifyLoginRequest = async (): Promise<Response> => {
    const req = await fetch("/api/authorize");
    const authResponse = await req.json();

    setSignInUrl(authResponse.url);

    // redirect them
    router.replace(authResponse.url);

    return authResponse;
  };

  const generateAccessToken = async (): Promise<String> => {
    const req = await fetch(`/api/getToken/${code}`);
    const token = await req.json();

    if (token) {
      setAccessToken(token.token);
      console.log("returning:", token.token.access_token);
      if (token.token) {
        if (token.token.access_token) {
          return token.token.access_token.toString();
        }
      }
    }

    throw console.error("Error");
  };

  const requestTopSongs = async (): Promise<any> => {
    const accessToken = await generateAccessToken();
    console.log("using Access token", accessToken);
    const req = await fetch(`api/getTopTracks/${accessToken}`);

    const tracks = await req.json();

    // pass to state
    console.log("Returned tracks:", tracks);
    setTopTracks(tracks);
  };

  const checkForCode = (): void => {
    if (router.query.code) {
      setCode(router.query.code.toString());
      // Save code in cookie
      document.cookie = `code=${code}`;
    }
    // }
  };
  useEffect(() => {
    checkForCode();
  });

  return (
    <Container maxWidth="md" style={{ padding: "64px" }}>
      <Grid container direction="column" spacing={3}>
        <Grid item>
          <Typography variant="h4" component="h1" gutterBottom>
            Spotify Playlist Expander
          </Typography>
        </Grid>

        {!code ? (
          <Grid item>
            <Button
              variant="contained"
              onClick={() => handleSpotifyLoginRequest()}
            >
              Login With Spotify
            </Button>
          </Grid>
        ) : (
          <React.Fragment>
            <Typography>User is signed in :P</Typography>

            <Button variant="contained" onClick={() => generateAccessToken()}>
              Generate Access Token
            </Button>

            <Button variant="contained" onClick={() => requestTopSongs()}>
              Request Top Tracks
            </Button>
          </React.Fragment>
        )}
      </Grid>

      <Grid container direction="row" spacing={2} style={{ padding: "16px" }}>
        {topTracks.map((track, index) => (
          <Grid item xs={12} key={track.external_ids.isrc}>
            <Typography>
              Track Number <b>{index + 1} </b>
              is <b>{track.name} </b> by
              <b> {track.artists[0].name}</b>
            </Typography>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
