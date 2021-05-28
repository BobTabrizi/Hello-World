export default async function handler(req, res) {
  const data = req.query;

  console.log(data.codeValue);

  var clientString =
    process.env.SPOTIFY_CLIENT_ID + ":" + process.env.SPOTIFY_CLIENT_SECRET;

  var encodedAuth = new Buffer(clientString).toString("base64");
  const getAccessToken = () => {
    let encodedRedirect = encodeURIComponent(`http://localhost:3000/`);

    return fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      body: `grant_type=authorization_code&code=${data.codeValue}&redirect_uri=${encodedRedirect}`,
      headers: {
        Authorization: "Basic " + encodedAuth,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
      .then((resp) => resp.json())
      .then((response) => {
        console.log("New Token Recieved");
        //console.log(response);
        return response;
      })
      .catch((error) => {
        console.log(error);
      });
  };
  let response = await getAccessToken();
  res.json(response);
}
