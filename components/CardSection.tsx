import React from "react";
import Grid from "@material-ui/core/Grid";
import Grow from "@material-ui/core/Grow";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import ArtistCard from "./ArtistCard";
import TrackCard from "./TrackCard";
import timePeriodMapper from "../lib/timePeriodMapper";

export default function CardSection(props: any) {
  // Destructure Props
  const cardType = props.cardType;
  const { data, type, timePeriod, detailToggle, changeToggle } = props;
  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      style={{ marginTop: "16px" }}
      spacing={3}
    >
      <Typography
        variant="subtitle2"
        component="h6"
        style={{ marginTop: "8px" }}
      >
        {timePeriodMapper[timePeriod]}
      </Typography>

      <Grid
        container
        item
        xs={12}
        direction="row"
        spacing={2}
        style={{ marginTop: "4px", marginBottom: "4px" }}
      >
        {type == "artist"
          ? data.map((artist: any, index: any) =>
              detailToggle ? (
                <Grow in={true} timeout={1000} key={index}>
                  <Grid item xs={12} sm={6} md={3}>
                    <ArtistCard
                      artist={artist}
                      cardType={"big"}
                      index={index + 1}
                    />
                  </Grid>
                </Grow>
              ) : (
                <Grid item xs={4} sm={3} md={1} key={index}>
                  <ArtistCard
                    artist={artist}
                    cardType={"small"}
                    index={index + 1}
                  />
                </Grid>
              )
            )
          : data.map((track: any, index: any) =>
              detailToggle ? (
                <Grow in={true} timeout={1000} key={index}>
                  <Grid item xs={12} sm={6} md={3}>
                    <TrackCard
                      track={track}
                      cardType={"big"}
                      index={index + 1}
                    />
                  </Grid>
                </Grow>
              ) : (
                <Grid item xs={4} sm={3} md={1} key={index}>
                  <TrackCard
                    track={track}
                    cardType={"small"}
                    index={index + 1}
                  />
                </Grid>
              )
            )}
        <Grid
          container
          direction="column"
          alignItems="flex-end"
          component="div"
        >
          <Button onClick={() => changeToggle(!detailToggle)}>
            {detailToggle ? "Show Less" : "Expand"}
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
}
