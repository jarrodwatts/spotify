import React, { useState, useEffect } from "react";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Link from "../src/Link";
import { useRouter } from "next/router";
import { access, accessSync } from "fs";
import { StringifyOptions } from "querystring";

const getCookie = (name: String): String | undefined => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts && parts.length === 2) {
    return parts.pop().split(";").shift();
  } else {
    return undefined;
  }
};

export default function Index() {
  const router = useRouter();
  const [topTracks, setTopTracks] = useState([]);

  const getAuthorizationCode = async (): Promise<Response> => {
    const req = await fetch("/api/authorize");
    const authResponse = await req.json();
    // redirect them with the url given back from authorize api
    // ( Takes them to login with spotify )
    await router.replace(authResponse.url);
    return authResponse;
  };

  const getTokenObject = async (): Promise<void> => {
    if (router.query.code) {
      const userCode = router.query.code;
      const req = await fetch(`/api/getToken/${userCode}`);
      const recievedTokenObject = await req.json();

      if (recievedTokenObject.access_token) {
        // Successfully Got back a token object - Store it
        document.cookie = `access_token=${recievedTokenObject.access_token}`;
        document.cookie = `refresh_token=${recievedTokenObject.refresh_token}`;
        return recievedTokenObject;
      } else {
        throw new Error(
          `No Access token was provided. API Returned back: ${recievedTokenObject}`
        );
      }
    }
  };

  const getNewAccessToken = async (): Promise<String | undefined> => {
    // Goal: To get a new access token with a given refresh token
    let refreshToken: String | undefined = getCookie("refresh_token");
    if (refreshToken) {
      let req = await fetch(`api/getNewAccessToken/${refreshToken}`);
      console.log("getNewAccessToken req:", req);
      let res = await req.json();
      console.log("getNewAccessToken res:", res);
      if (res.access_token) {
        document.cookie = `access_token=${res.access_token}`;
        return res.access_token;
      } else {
        return undefined;
      }
    } else {
      return undefined;
    }
  };

  const requestTopSongs = async (): Promise<any> => {
    let accessToken: String | undefined = getCookie("access_token");
    let req = await fetch(`api/getTopTracks/${accessToken}`);
    let res = await req.json();

    if (res.status == 401) {
      // Need a new access token
      accessToken = await getNewAccessToken();
      // Try Again
      console.log("requestTopSongs accessToken:", accessToken);
      //accessToken = getCookie("access_token");
      req = await fetch(`api/getTopTracks/${accessToken}`);
      res = await req.json();
    }
    // pass to state
    console.log("Returned tracks:", res);
    setTopTracks(res);
    
  };

  return (
    <Container maxWidth="md" style={{ padding: "64px" }}>
      <Grid container direction="column" spacing={3}>
        <Grid item>
          <Typography variant="h4" component="h1" gutterBottom>
            Spotify Playlist Expander
          </Typography>
        </Grid>
      </Grid>

      {/* 1. User Authorization Request
        Sending: Redirecting Users to an Auth page containing our applications' client id
        Recieving: Recieving a unique authorization code

        2. User Comes back with an accepted access to their account's requested scopes.
        The URL now contains a ?code=xxx value containing the authorization code
      */}
      <Button variant="contained" onClick={() => getAuthorizationCode()}>
        Allow Us To Access Your Account
      </Button>

      {/* 4. Application Requests Access Token
      Sending: Authorization Code
      Recieving: Access Token, Refresh Token  
      
      5. Spotify Grants Access Token (And Refresh Token)*/}
      <Button variant="contained" onClick={() => getTokenObject()}>
        Provide Us with An Access Token
      </Button>

      {/* 6. Use Access Token to Make Authenticated Requests  */}
      <Button variant="contained" onClick={() => requestTopSongs()}>
        Get Top Songs
      </Button>

      <Grid container direction="row" spacing={2} style={{ padding: "32px" }}>
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
