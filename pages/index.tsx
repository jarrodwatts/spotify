import React, { useState, useEffect } from "react";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
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

export default function Index() {
  const router = useRouter();
  const [topArtistsLongTerm, setTopArtistsLongTerm] = useState([]);
  const [topArtistsMediumTerm, setTopArtistsMediumTerm] = useState([]);
  const [topArtistsShortTerm, setTopArtistsShortTerm] = useState([]);
  const [topTracksLongTerm, setTopTracksLongTerm] = useState([]);
  const [topTracksMediumTerm, setTopTracksMediumTerm] = useState([]);
  const [topTracksShortTerm, setTopTracksShortTerm] = useState([]);
  const [detailToggles, updateDetailToggles] = useState({
    topArtistsLongTerm: false,
    topArtistsMediumTerm: false,
    topArtistsShortTerm: false,
    topTracksLongTerm: false,
    topTracksMediumTerm: false,
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

      switch (timeRange) {
        case "long_term":
          setTopArtistsLongTerm(res);
          break;
        case "medium_term":
          setTopArtistsMediumTerm(res);
          break;
        case "short_term":
          setTopArtistsShortTerm(res);
          break;
      }
    }
  };

  const requestToptracksForTimeRange = async (
    timeRange: String
  ): Promise<any> => {
    if (getCookie("refresh_token")) {
      const accessToken = await getNewAccessToken();
      const req = await fetch(
        `api/getTracks?access_token=${accessToken}&time_range=${timeRange}`
      );
      const res = await req.json();

      switch (timeRange) {
        case "long_term":
          setTopTracksLongTerm(res);
          break;
        case "medium_term":
          setTopTracksMediumTerm(res);
          break;
        case "short_term":
          setTopTracksShortTerm(res);
          break;
      }
    }
  };

  useEffect(() => {
    if (getCookie("access_token")) {
      requestTopArtistsForTimeRange("long_term");
      requestTopArtistsForTimeRange("medium_term");
      requestTopArtistsForTimeRange("short_term");
      requestToptracksForTimeRange("long_term");
      requestToptracksForTimeRange("medium_term");
      requestToptracksForTimeRange("short_term");
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

        <CardSection
          type={"artist"}
          data={topArtistsLongTerm}
          timePeriod={"long"}
          detailToggle={detailToggles.topArtistsLongTerm}
          changeToggle={(value: boolean) =>
            updateDetailToggles({
              ...detailToggles,
              topArtistsLongTerm: value,
            })
          }
        />
        <Divider style={{ width: "100%" }} />
        <CardSection
          type={"artist"}
          data={topArtistsMediumTerm}
          timePeriod={"medium"}
          detailToggle={detailToggles.topArtistsMediumTerm}
          changeToggle={(value: boolean) =>
            updateDetailToggles({
              ...detailToggles,
              topArtistsMediumTerm: value,
            })
          }
        />
        <Divider style={{ width: "100%" }} />
        <CardSection
          type={"artist"}
          data={topArtistsShortTerm}
          timePeriod={"short"}
          detailToggle={detailToggles.topArtistsShortTerm}
          changeToggle={(value: boolean) =>
            updateDetailToggles({
              ...detailToggles,
              topArtistsShortTerm: value,
            })
          }
        />
        <Divider style={{ width: "100%" }} />

        <Grid item style={{ marginTop: "8px" }}>
          <Typography variant="h4" component="h2">
            Your Top Tracks
          </Typography>
        </Grid>
        <CardSection
          type={"track"}
          data={topTracksLongTerm}
          timePeriod={"long"}
          detailToggle={detailToggles.topTracksLongTerm}
          changeToggle={(value: boolean) =>
            updateDetailToggles({
              ...detailToggles,
              topTracksLongTerm: value,
            })
          }
        />
        <Divider style={{ width: "100%" }} />

        <CardSection
          type={"track"}
          data={topTracksMediumTerm}
          timePeriod={"medium"}
          detailToggle={detailToggles.topTracksMediumTerm}
          changeToggle={(value: boolean) =>
            updateDetailToggles({
              ...detailToggles,
              topTracksMediumTerm: value,
            })
          }
        />
        <Divider style={{ width: "100%" }} />

        <CardSection
          type={"track"}
          data={topTracksShortTerm}
          timePeriod={"short"}
          detailToggle={detailToggles.topTracksShortTerm}
          changeToggle={(value: boolean) =>
            updateDetailToggles({
              ...detailToggles,
              topTracksShortTerm: value,
            })
          }
        />
        <Divider style={{ width: "100%" }} />
      </Grid>
    </Container>
  );
}
