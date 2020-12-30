import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { useRouter } from "next/router";

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
  },
});

export default function PlaylistCard(props: any) {
  const router = useRouter();
  const classes = useStyles();
  const {
    image,
    name,
    description,
    owner,
    id,
    tracksHref,
    tracksNumber,
    url,
  } = props.playlist;

  return (
    <Card className={classes.root}>
      <CardActionArea>
        <CardMedia
          component="img"
          alt={name}
          height="140 "
          image={image}
          title={name}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {name}
          </Typography>
          <Typography gutterBottom variant="subtitle2" component="h4">
            {owner}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size="small" color="primary"
        onClick={() => router.push(`/playlist/${id}`)}>
          View Playlist
        </Button>
      </CardActions>
    </Card>
  );
}
