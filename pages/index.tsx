import React, { useState, useEffect } from "react";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Link from "../src/Link";
import { useRouter } from "next/router";
import Grow from "@material-ui/core/Grow";
import getCookie from "../lib/getCookie";
import ArtistCard from "../components/ArtistCard";

export default function Index() {
  const router = useRouter();
  const [topTracks, setTopTracks] = useState([]);
  const [topArtistsLongTerm, setTopArtistsLongTerm] = useState([]);
  const [topArtistsMidTerm, setTopArtistsMidTerm] = useState([]);
  const [topArtistsShortTerm, setTopArtistsShortTerm] = useState([]);
  const [detailToggles, updateDetailToggles] = useState({
    topArtistsLongTerm: false,
    topArtistsMidTerm: false,
    topArtistsShortTerm: false,
    topTracksLongTerm: false,
    topTracksMidTerm: false,
    topTracksShortTerm: false,
  });

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

  const requestTopArtistsLongTerm = async (): Promise<any> => {
    const accessToken = await getNewAccessToken();
    const req = await fetch(`api/getTopArtistsLongTerm/${accessToken}`);
    const res = await req.json();
    setTopArtistsLongTerm(res);
  };

  const requestTopArtistsMidTerm = async (): Promise<any> => {
    const accessToken = await getNewAccessToken();
    const req = await fetch(`api/getTopArtistsMidTerm/${accessToken}`);
    const res = await req.json();
    setTopArtistsMidTerm(res);
  };

  const requestTopArtistsShortTerm = async (): Promise<any> => {
    const accessToken = await getNewAccessToken();
    const req = await fetch(`api/getTopArtistsShortTerm/${accessToken}`);
    const res = await req.json();
    setTopArtistsShortTerm(res);
  };

  useEffect(() => {
    if (getCookie("access_token")) {
      requestTopArtistsLongTerm();
      requestTopArtistsMidTerm();
      requestTopArtistsShortTerm();
    }
  }, []);

  return (
    <Container maxWidth="lg" style={{ padding: "64px" }}>
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

      <Grid
        container
        direction="column"
        alignItems="center"
        style={{ marginTop: "16px" }}
        spacing={3}
      >
        <Grid item xs={12}>
          <Typography variant="h2" component="h1">
            Your Spotify Profile Summary
          </Typography>

          <Typography variant="h4" component="h2" style={{ marginTop: "32px" }}>
            Your Top Artists
          </Typography>

          <Typography
            variant="subtitle2"
            component="h6"
            style={{ marginTop: "8px" }}
          >
            Long Term (Several Years)
          </Typography>

          <Grid
            container
            item
            xs={12}
            direction="row"
            spacing={2}
            style={{ marginTop: "4px", marginBottom: "4px" }}
          >
            {topArtistsLongTerm.map((artist, index) =>
              detailToggles.topArtistsLongTerm ? (
                <Grow in={true} timeout={1000} key={index}>
                  <Grid item xs={12} sm={6} md={3}>
                    <ArtistCard artist={artist} cardType={"big"} />
                  </Grid>
                </Grow>
              ) : (
                <Grid item xs={4} sm={3} md={1} key={index}>
                  <ArtistCard artist={artist} cardType={"small"} />
                </Grid>
              )
            )}
            <Grid
              container
              direction="column"
              alignItems="flex-end"
              justify="flex-end"
            >
              <Button
                onClick={() =>
                  updateDetailToggles({
                    ...detailToggles,
                    topArtistsLongTerm: !detailToggles.topArtistsLongTerm,
                  })
                }
              >
                {detailToggles.topArtistsLongTerm ? "Hide" : "Expand"}
              </Button>
            </Grid>
          </Grid>

          <Typography
            variant="subtitle2"
            component="h6"
            style={{ marginTop: "8px" }}
          >
            Medium Term (6 Months)
          </Typography>

          <Grid
            container
            item
            xs={12}
            direction="row"
            spacing={2}
            style={{ marginTop: "4px", marginBottom: "4px" }}
          >
            {topArtistsMidTerm.map((artist, index) =>
              detailToggles.topArtistsMidTerm ? (
                <Grow in={true} timeout={1000} key={index}>
                  <Grid item xs={12} sm={6} md={3}>
                    <ArtistCard artist={artist} cardType={"big"} />
                  </Grid>
                </Grow>
              ) : (
                <Grid item xs={4} sm={3} md={1} key={index}>
                  <ArtistCard artist={artist} cardType={"small"} />
                </Grid>
              )
            )}
            <Grid
              container
              direction="column"
              alignItems="flex-end"
              justify="flex-end"
            >
              <Button
                onClick={() =>
                  updateDetailToggles({
                    ...detailToggles,
                    topArtistsMidTerm: !detailToggles.topArtistsMidTerm,
                  })
                }
              >
                {detailToggles.topArtistsMidTerm ? "Hide" : "Expand"}
              </Button>
            </Grid>
          </Grid>

          <Typography
            variant="subtitle2"
            component="h6"
            style={{ marginTop: "8px" }}
          >
            Short Term (4 Weeks)
          </Typography>

          <Grid
            container
            item
            xs={12}
            direction="row"
            spacing={2}
            style={{ marginTop: "4px", marginBottom: "4px" }}
          >
            {topArtistsShortTerm.map((artist, index) =>
              detailToggles.topArtistsShortTerm ? (
                <Grow in={true} timeout={1000} key={index}>
                  <Grid item xs={12} sm={6} md={3}>
                    <ArtistCard artist={artist} cardType={"big"} />
                  </Grid>
                </Grow>
              ) : (
                <Grid item xs={4} sm={3} md={1} key={index}>
                  <ArtistCard artist={artist} cardType={"small"} />
                </Grid>
              )
            )}
            <Grid
              container
              direction="column"
              alignItems="flex-end"
              justify="flex-end"
            >
              <Button
                onClick={() =>
                  updateDetailToggles({
                    ...detailToggles,
                    topArtistsShortTerm: !detailToggles.topArtistsShortTerm,
                  })
                }
              >
                {detailToggles.topArtistsShortTerm ? "Hide" : "Expand"}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}
