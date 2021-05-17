import { connectToDatabase } from "../../../util/mongodb";
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

const getSongs = (token, url) => {
  return fetch(`https://api.spotify.com/v1/playlists/${url}`, {
    method: "GET",
    params: { limit: 1 },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((resp) => resp.json())
    .then((response) => {
      console.log(response);
      return response.tracks;
    })
    .catch((error) => {
      console.log(error);
    });
};

export default async function handler(req, res) {
  const { db } = await connectToDatabase();

  const countryID = req.query.id;
  const url = req.query.url;
  //Find the corresponding url and pass it
  // const url = "";

  let pulledList = await setAccessToken()
    .then((token) => {
      return getSongs(token, url);
    })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.log(error);
    });
  //console.log(temp);
  pulledList.countryID = countryID;
  pulledList.url = url;
  pulledList.spotifyOwned = true;
  pulledList.genre = "Popular";

  delete pulledList.limit,
    delete pulledList.next,
    delete pulledList.previous,
    delete pulledList.offset;

  const response = await db.collection("Playlists").insertOne(pulledList);
  res.json(response);
  console.log(response);
}
