export default function handler(req: any, res: any) {
  try {
    const { access_token } = req.query;
    const ENDPOINT = `	https://api.spotify.com/v1/me/playlists?limit=50`;

    const getData = async () => {
      const playlistData = await fetch(ENDPOINT, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      const { items } = await playlistData.json();

      const playlists = items.map((playlist: any) => ({
        image: (playlist.images || [])[0]?.url,
        name: playlist.name,
        description: playlist.description,
        owner: playlist.owner.display_name,
        id: playlist.id,
        tracksHref: playlist.tracks.href,
        tracksNumber: playlist.tracks.total,
        url: playlist.external_urls.spotify,
      }));

      if (playlists) {
        return res.status(200).json(playlists);
      }
    };
    return getData();
  } catch (error) {
    console.error("Error Occurred Getting Top Songs:", error);
    return res.status(400);
  }
}
