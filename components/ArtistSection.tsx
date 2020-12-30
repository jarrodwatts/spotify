import React from "react";
import Grid from "@material-ui/core/Grid";
import Grow from "@material-ui/core/Grow";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import ArtistCard from "./ArtistCard";
import timePeriodMapper from '../lib/timePeriodMapper';

export default function ArtistSection(props: any) {
  // Destructure Props
  const cardType = props.cardType;
  const { artists, timePeriod, detailToggle, changeToggle } = props;
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
        {artists.map((artist: any, index: any) =>
          detailToggle ? (
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
          component="div"
        >
          <Button onClick={() => changeToggle(!detailToggle)}>
            {detailToggle ? "Hide" : "Expand"}
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
}
