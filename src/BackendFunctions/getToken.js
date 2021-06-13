export default function getToken() {
  var AccessTokenSet = false;
  var AccessToken = null;
  const setAccessToken = () => {
    let tokenPromise = null;
    if (!AccessTokenSet) {
      tokenPromise = getAccessToken()
        .then((response) => {
          AccessTokenSet = true;
          return response.access_token;
        })
        .catch((error) => {
          AccessTokenSet = false;
          console.log(error);
        });
      AccessToken = tokenPromise.then((accessToken) => {
        return accessToken;
      });
    }
    return AccessToken;
  };

  var clientString =
    process.env.SPOTIFY_CLIENT_ID + ":" + process.env.SPOTIFY_CLIENT_SECRET;

  var encodedAuth = new Buffer(clientString).toString("base64");

  const getAccessToken = () => {
    return fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      body: `grant_type=client_credentials`,
      headers: {
        Authorization: "Basic " + encodedAuth,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
      .then((resp) => resp.json())
      .then((response) => {
        console.log("New Token Recieved");
        return response;
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return setAccessToken();
}
