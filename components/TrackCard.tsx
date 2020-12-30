import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import Grid from "@material-ui/core/Grid";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Link from "next/link";
import capitalize from "../lib/capitalize";

const useStyles = makeStyles({
  root: {
    //height: "260px",
  },
  media: {
    height: 140,
    textAlign: "center",
  },
});

export default function ArtistCard(props: any) {
  const classes = useStyles();

  // Destructure Props
  const cardType = props.cardType;
  const { image, name, artist, popularity, id, url, preview_url } = props.track;
  const index = props.index;

  if (cardType == "big") {
    return (
      <Card className={classes.root}>
        <Link href={url}>
          <CardActionArea>
            <CardMedia className={classes.media} image={image} title={name} />
            <CardContent>
              <Grid
                container
                direction="column"
                justify="space-between"
                alignItems="center"
                spacing={1}
                style={{ height: "100%", width: "100%" }}
              >
                <Grid item>
                  <Typography gutterBottom variant="h5" component="h3">
                    #{index}: <b>{name}</b>
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography gutterBottom variant="subtitle2" component="p">
                    {artist}
                  </Typography>
                </Grid>

                <Grid item>
                  <Typography gutterBottom variant="subtitle2" component="p">
                    {"Popularity Score: " + popularity}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </CardActionArea>
        </Link>
      </Card>
    );
  } else {
    return (
      <Card className={classes.root}>
        <CardMedia className={classes.media} image={image} title={name} />
      </Card>
    );
  }
}
