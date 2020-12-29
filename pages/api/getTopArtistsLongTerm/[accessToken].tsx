import * as querystring from "querystring";

export default function handler(req: any, res: any) {
  try {
    const access_token = req.query.accessToken;

    const TOP_ARTISTS_ENDPOINT = `https://api.spotify.com/v1/me/top/artists?limit=12&time_range=long_term`;

    const getData = async () => {
      const trackData = await fetch(TOP_ARTISTS_ENDPOINT, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      const { items } = await trackData.json();

      const artists = items.map((artist: any) => ({
        genres: artist.genres,
        image: artist.images[0].url,
        name: artist.name,
        popularity: artist.popularity,
        id: artist.id,
        url: artist.external_urls.spotify,
      }));

      if (artists) {
        console.log(artists);
        return res.status(200).json(artists);
      }
    };
    return getData();
  } catch (error) {
    console.error("Error Occurred Getting Top Songs:", error);
    return res.status(400);
  }
}
