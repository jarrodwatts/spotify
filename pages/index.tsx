import React, { useState, useEffect } from "react";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { useRouter } from "next/router";
import getCookie from "../lib/getCookie";
import ArtistSection from "../components/ArtistSection";
import {
  getAuthorizationCode,
  getTokenObject,
  getNewAccessToken,
} from "../lib/auth/getAuthorization";

export default function Index() {
  const router = useRouter();
  const [topArtistsLongTerm, setTopArtistsLongTerm] = useState([]);
  const [detailToggles, updateDetailToggles] = useState({
    topArtistsLongTerm: false,
    topArtistsMidTerm: false,
    topArtistsShortTerm: false,
    topTracksLongTerm: false,
    topTracksMidTerm: false,
    topTracksShortTerm: false,
  });

  const requestTopArtistsForTimeRange = async (
    timeRange: String
  ): Promise<any> => {
    if (getCookie("refresh_token")) {
      const accessToken = await getNewAccessToken();
      const req = await fetch(
        `api/getArtists?access_token=${accessToken}&time_range=${timeRange}`
      );
      const res = await req.json();
      setTopArtistsLongTerm(res);
    }
  };

  useEffect(() => {
    if (getCookie("access_token")) {
      requestTopArtistsForTimeRange("long_term");
    }
  }, []);

  return (
    <Container maxWidth="lg" style={{ padding: "64px" }}>
      <Button variant="contained" onClick={() => getAuthorizationCode(router)}>
        Allow Us To Access Your Account
      </Button>

      <Button variant="contained" onClick={() => getTokenObject(router.query)}>
        Provide Us with An Access Token
      </Button>

      <Grid
        container
        direction="column"
        alignItems="center"
        spacing={2}
        style={{ marginTop: "32px" }}
      >
        <Grid item>
          <Typography variant="h2" component="h1">
            Your Spotify Profile Summary
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="h4" component="h2">
            Your Top Artists
          </Typography>
        </Grid>

        <ArtistSection
          artists={topArtistsLongTerm}
          timePeriod={"long"}
          detailToggle={detailToggles.topArtistsLongTerm}
          changeToggle={(value: boolean) =>
            updateDetailToggles({
              ...detailToggles,
              topArtistsLongTerm: value,
            })
          }
        />
      </Grid>
    </Container>
  );
}
