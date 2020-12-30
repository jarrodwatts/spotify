export default function handler(req: any, res: any) {
  try {
    const { access_token, time_range } = req.query;
    const TOP_TRACKS_ENDPOINT = `https://api.spotify.com/v1/me/top/tracks?limit=12&time_range=${time_range}`;

    const getData = async () => {
      const trackData = await fetch(TOP_TRACKS_ENDPOINT, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      const { items } = await trackData.json();

      const tracks = items.map((track: any) => ({
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
