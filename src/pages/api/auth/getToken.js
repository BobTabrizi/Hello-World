var querystring = require("querystring");
export default async function handler(req, res) {
  const data = req.query;
  var clientString =
    process.env.SPOTIFY_CLIENT_ID + ":" + process.env.SPOTIFY_CLIENT_SECRET;

  var encodedAuth = new Buffer(clientString).toString("base64");
  const getAccessToken = () => {
    let encodedRedirect = encodeURIComponent(
      `${process.env.NEXT_PUBLIC_PROD_URL}/`
    );

    let queryData;
    if (data.Type === "Anon") {
      queryData = {
        grant_type: `client_credentials`,
      };
    } else {
      queryData = {
        grant_type: `authorization_code`,
        code: `${data.codeValue}`,
        redirect_uri: `${process.env.NEXT_PUBLIC_PROD_URL}/`,
      };
    }
    let dataParam = querystring.stringify(queryData);

    return fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      body: dataParam,
      headers: {
        Authorization: "Basic " + encodedAuth,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
      .then((resp) => resp.json())
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.log(error);
      });
  };
  let response = await getAccessToken();
  res.json(response);
}
