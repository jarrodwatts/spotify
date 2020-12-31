export default function handler(req: any, res: any) {
  try {
    const { access_token, playlist_id } = req.query;
    const ENDPOINT = `https://api.spotify.com/v1/playlists/${playlist_id}`;

    const getData = async () => {
      const playlistData = await fetch(ENDPOINT, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      const data = await playlistData.json();

      let {
        description,
        external_urls,
        followers,
        id,
        images,
        name,
        owner,
        tracks,
      } = data;

      tracks = tracks.items.map((track: any) => ({
        image: track.track.album.images[2].url,
        name: track.track.name,
        artist: track.track.artists[0].name,
        artistDetail: track.track.artists,
        popularity: track.track.popularity,
        id: track.track.id,
        url: track.track.external_urls.spotify,
        preview_url: track.track.preview_url,
        albumName: track.track.album.name,
      }));

      if (tracks) {
        console.log("Tracks:", tracks);
        return res.status(200).json({
          url: external_urls.spotify,
          description: description,
          followers: followers.total,
          id: id,
          image: images[0].url,
          name: name,
          owner: owner.display_name,
          tracks: tracks,
        });
      } else {
        console.log("No tracks found");
      }
    };
    return getData();
  } catch (error) {
    console.error("Error Occurred Getting Top Songs:", error);
    return res.status(400);
  }
}
