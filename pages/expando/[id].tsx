import React, { useState, useEffect } from "react";
import {
  makeStyles,
  useTheme,
  Theme,
  createStyles,
} from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableFooter from "@material-ui/core/TableFooter";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableHead from "@material-ui/core/TableHead";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import Avatar from "@material-ui/core/Avatar";
import Tooltip from "@material-ui/core/Tooltip";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";
import Divider from "@material-ui/core/Divider";
import getCookie from "../../lib/getCookie";
import { getNewAccessToken, getUserId } from "../../lib/auth/getAuthorization";
import { useRouter } from "next/router";

const useStyles = makeStyles({
  table: {
    minWidth: 500,
  },
  large: {
    width: "64px",
    height: "64px",
  },
});

export default function ExpandoId({ queryId }) {
  const router = useRouter();
  const classes = useStyles();
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [playlistInformation, setPlaylistInformation] = useState({});
  const [makingPlaylist, setMakingPlaylist] = useState(false);
  const [newPlaylistTracks, updateNewPlaylistTracks] = useState([]);

  const requestPlaylistTracks = async (): Promise<any> => {
    if (getCookie("refresh_token")) {
      const accessToken = await getNewAccessToken();
      const req: any = await fetch(
        `/api/getDetailFromPlaylistId?access_token=${accessToken}&playlist_id=${queryId}`
      );
      const res: any = await req.json();

      const {
        url,
        description,
        followers,
        id,
        image,
        name,
        owner,
        tracks,
      } = res;

      console.log("Tacks:", tracks);
      setPlaylistTracks(tracks);
      setPlaylistInformation({
        url,
        description,
        followers,
        id,
        image,
        name,
        owner,
      });
    }
  };

  const triggerPlaylistCreation = async (): Promise<any> => {
    setMakingPlaylist(!makingPlaylist);

    // 1. Create a new playlist
    // 1A. Create an endpoint to create a new playlist and return a reference to that playlist here
    if (getCookie("refresh_token")) {
      const accessToken = await getNewAccessToken();
      console.log("Got access token", accessToken);
      // Need a user Id for the next API call.
      const user_id = await getUserId(accessToken);
      console.log("Got user id", user_id);

      // Create a playlist

      const createPlaylistReq = await fetch(
        `/api/createPlaylist?access_token=${accessToken}&user_id=${user_id}`
      );
      const createdPlaylist: any = await createPlaylistReq.json();
      console.log(
        "Recieved back a new created playlist object:",
        createdPlaylist
      );

      // 2. For each artist in the playlistTracks state variable
      //A. Get their unique Ids
      let artists: any = playlistTracks.map((artist) =>
        artist.artistDetail.map((a) => a.id)
      );

      // Join all the nested arrays to one single string
      artists = artists.join();
      // Separate the array into single array of artist ids
      artists = artists.split(",");
      //Filter array for unique artist ids
      artists = artists.filter((x, i, a) => a.indexOf(x) == i);

      console.log("List of artists;", artists);

      // 3. Fetch that artists top 5? songs,
      let accumulatedNewTracks = [];
      for (let artist of artists) {
        console.log("Doing stuff for", artist);
        // New endpoint to fetch top songs
        // Create a playlist
        let artistTopTracksReq = await fetch(
          `/api/getArtistsTopTracks?access_token=${accessToken}&artist_id=${artist}`
        );

        // 4. Return back the 5 top songs from that given artist from the API
        let artistsTopTracks = await artistTopTracksReq.json();
        let artistsTopTrackSpotifyTrackIds = artistsTopTracks.map(
          (track) => "spotify:track:" + track.id
        );

        for (let z = 0; z < artistsTopTracks.length; z++) {
          if (accumulatedNewTracks.indexOf(artistsTopTracks[z]) == -1) {
            accumulatedNewTracks.push(artistsTopTracks[z]);
            updateNewPlaylistTracks([...accumulatedNewTracks]);
          }
        }
        //Make a request to api
        let addTracksToPlaylistReq = await fetch(
          `/api/addTracksToPlaylist?access_token=${accessToken}&playlist_id=${
            createdPlaylist.id
          }&tracks=${artistsTopTrackSpotifyTrackIds.join()}`
        );

        const addedTracksResponse: any = await addTracksToPlaylistReq.json();
        console.log("Recieved back a Response:", addedTracksResponse);
      }
    }
  };

  useEffect(() => {
    if (getCookie("access_token")) {
      requestPlaylistTracks();
    }
  }, []);

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
            Please Confirm
          </Typography>
        </Grid>

        <Grid item>
          <Typography variant="subtitle1" component="h2">
            You are about to create a new playlist based on the artists found in
            playlist: <b>{playlistInformation.name}</b>
          </Typography>
        </Grid>

        <Grid item>
          <Typography variant="subtitle1" component="h2">
            <b>Note:</b> This will effect your <u>real</u> Spotify Account.
          </Typography>
        </Grid>

        <Grid item>
          <Button
            disabled={makingPlaylist}
            variant="contained"
            color="primary"
            onClick={() => triggerPlaylistCreation()}
          >
            Confirm and Create Playlist
          </Button>
        </Grid>

        <Divider style={{ width: "100%", marginBottom: "4px" }} />

        {makingPlaylist ? (
          <Grid container item>
            <Grid item>
              <Typography>
                Starting to Make Playlist:
                <b> {playlistInformation.name + " (Expando)"}</b>
              </Typography>
            </Grid>
          </Grid>
        ) : null}
      </Grid>

      <Divider
        style={{ width: "100%", marginBottom: "4px", marginTop: "4px" }}
      />

      {newPlaylistTracks.length !== 0 ? (
        <Grid container direction="column" spacing={1}>
          {newPlaylistTracks.map((track, key) => (
            <Grid item key={key}>
              {track.name} - {track.artist}
            </Grid>
          ))}
        </Grid>
      ) : null}
    </Container>
  );
}

export async function getServerSideProps(context: any) {
  // HACK - we need the id of the query to load before we make the useEffect request so ...
  return {
    props: {
      queryId: context.params.id,
    },
  };
}
