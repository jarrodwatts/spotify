export default function handler(req: any, res: any) {
  try {
    const { access_token, artist_id } = req.query;
    const ENDPOINT = `https://api.spotify.com/v1/artists/${artist_id}/top-tracks?country=US`;

    const getData = async () => {
      const topTracksData = await fetch(ENDPOINT, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      let { tracks } = await topTracksData.json();
      console.log(tracks);

      tracks = tracks.map((track: any) => ({
        image: track.album.images[0].url,
        name: track.name,
        artist: track.artists[0].name,
        popularity: track.popularity,
        id: track.id,
        url: track.external_urls.spotify,
        preview_url: track.preview_url, 
      }));

      if (tracks) {
        return res.status(200).json(tracks);
      }
    };
    return getData();
  } catch (error) {
    console.error("Error Occurred Getting Top Songs:", error);
    return res.status(400);
  }
}
