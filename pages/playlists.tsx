import React, { useState, useEffect } from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import { useRouter } from "next/router";
import getCookie from "../lib/getCookie";
import CardSection from "../components/CardSection";
import {
  getAuthorizationCode,
  getTokenObject,
  getNewAccessToken,
} from "../lib/auth/getAuthorization";
import Divider from "@material-ui/core/Divider";
import Link from "next/link";
import PlaylistCard from "../components/PlaylistCard";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: "center",
      color: theme.palette.text.secondary,
    },
  })
);

export default function Playlists() {
  const classes = useStyles();
  const [playlists, setPlaylists] = useState([]);

  const requestUserPlaylists = async (): Promise<any> => {
    if (getCookie("refresh_token")) {
      const accessToken = await getNewAccessToken();
      const req = await fetch(
        `api/getUserPlaylists?access_token=${accessToken}`
      );
      const res = await req.json();
      setPlaylists(res);
    }
  };

  useEffect(() => {
    if (getCookie("access_token")) {
      requestUserPlaylists();
    }
  }, []);

  console.log(playlists);
  return (
    <Container maxWidth="lg" style={{ padding: "64px" }}>
      <Grid
        container
        direction="column"
        alignItems="center"
        spacing={2}
        style={{ marginTop: "32px" }}
      >
        <Grid item>
          <Typography variant="h2" component="h1">
            Your Spotify Playlists
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="subtitle1" component="h2">
            Here you can view your playlists, and use our Expando functionality
            to create a playlist with new music you'll love!
          </Typography>
        </Grid>
      </Grid>

      <Grid
        container
        item
        xs={12}
        direction="row"
        spacing={2}
        style={{ marginTop: "4px", marginBottom: "4px" }}
      >
        {playlists.map((playlist) => (
          <Grow in={true} timeout={1000} key={playlist.id}>
            <Grid item xs={12} sm={6} md={3}>
              <PlaylistCard playlist={playlist} />
            </Grid>
          </Grow>
        ))}
      </Grid>
    </Container>
  );
}
