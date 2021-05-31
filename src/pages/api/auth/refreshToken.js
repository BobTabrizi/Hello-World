export default async function handler(req, res) {
  const data = req.query;
  var clientString =
    process.env.SPOTIFY_CLIENT_ID + ":" + process.env.SPOTIFY_CLIENT_SECRET;

  var encodedAuth = new Buffer(clientString).toString("base64");
  const getAccessToken = () => {
    return fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      body: `grant_type=refresh_token&refresh_token=${data.tokenValue}`,
      headers: {
        Authorization: "Basic " + encodedAuth,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
      .then((resp) => resp.json())
      .then((response) => {
        console.log("New Token Recieved");
        console.log(response);
        return response;
      })
      .catch((error) => {
        console.log(error);
      });
  };
  let response = await getAccessToken();
  res.json(response);
}
