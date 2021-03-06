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
import { getNewAccessToken } from "../../lib/auth/getAuthorization";
import { useRouter } from "next/router";

const useStyles1 = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexShrink: 0,
      marginLeft: theme.spacing(2.5),
    },
  })
);

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number
  ) => void;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
  const classes = useStyles1();
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <div className={classes.root}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </div>
  );
}

const useStyles2 = makeStyles({
  table: {
    minWidth: 500,
  },
  large: {
    width: "64px",
    height: "64px",
  },
});

export default function PlaylistId({ queryId }) {
  const router = useRouter();
  const classes = useStyles2();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [playlistInformation, setPlaylistInformation] = useState({});

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

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

  useEffect(() => {
    if (getCookie("access_token")) {
      requestPlaylistTracks();
    }
  }, []);

  console.log(playlistTracks);
  console.log(playlistInformation);
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
            Here you can view your playlist's tracks, and use our Expando
            functionality to create a playlist with new music you'll love!
          </Typography>
        </Grid>
        <Divider style={{ width: "100%", marginBottom: "4px" }} />

        <Grid container alignItems="center" item spacing={2}>
          <Grid item>
            <Avatar
              alt={playlistInformation.name}
              src={playlistInformation.image}
              className={classes.large}
            />
          </Grid>
          <Grid item>
            <Typography variant="h5" component="h5">
              <b>{playlistInformation.name}</b> · {playlistInformation.owner} ·
            </Typography>
          </Grid>

          <Grid item>
            <Typography variant="subtitle1" component="p">
              <b>{playlistInformation.followers} Followers</b>
            </Typography>
          </Grid>

          <Grid item>
            <Tooltip title="Create a new playlist with more songs similar to this one, based on the artists within it.">
              <Button
                onClick={() => router.push(`/expando/${queryId}`)}
                variant="contained"
                color="primary"
              >
                Expando this Playlist ❔
              </Button>
            </Tooltip>
          </Grid>

          <Grid container item>
            {playlistInformation.description}
          </Grid>
        </Grid>
      </Grid>

      <TableContainer component={Paper} style={{ marginTop: "16px" }}>
        <Table className={classes.table} aria-label="custom pagination table">
          <TableHead>
            <TableRow>
              <TableCell>Cover</TableCell>
              <TableCell>Track</TableCell>
              <TableCell>Album</TableCell>
              <TableCell>Artist</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? playlistTracks.slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage
                )
              : playlistTracks
            ).map((track, index) => (
              <TableRow key={track.id}>
                <TableCell component="th" scope="row">
                  <Avatar alt={track.name} src={track.image} />
                </TableCell>
                <TableCell>{track.name}</TableCell>
                <TableCell>{track.albumName}</TableCell>
                <TableCell>{track.artist}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[10, 50, 100, { label: "All", value: -1 }]}
                colSpan={3}
                count={playlistTracks.length}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                  inputProps: { "aria-label": "Tracks per page" },
                  native: true,
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
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
