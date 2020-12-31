export default function handler(req: any, res: any) {
  try {
    const { access_token } = req.query;
    console.log("Access token at getUserId:", access_token);
    const ENDPOINT = `https://api.spotify.com/v1/me`;

    const getData = async () => {
      const userData = await fetch(ENDPOINT, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      const userDataRes = await userData.json();
      console.log("userData;", userDataRes);
      //const id = await userDataRes.id;
      //console.log("id:", id);
      if (userDataRes) {
        return res.status(200).json(userDataRes);
      } else {
        return new Error("No User found with provided access token");
      }
    };
    return getData();
  } catch (error) {
    console.error("Error Occurred Getting Top Songs:", error);
    return res.status(400);
  }
}
