import { connectToDatabase } from "../../../../util/mongodb";
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
      // console.log(response);
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

  pulledList.Playlists = [
    {
      genre: "Popular",
      url: url,
      href: pulledList.href,
      totalTracks: pulledList.total,
      spotifyOwned: true,
      tracks: pulledList.items,
    },
  ];
  pulledList.countryID = countryID;
  let listTracks = pulledList.Playlists[0].tracks;
  for (let i = 0; i < pulledList.total; i++) {
    listTracks[i].countryID = countryID;
  }
  delete pulledList.limit,
    delete pulledList.next,
    delete pulledList.previous,
    delete pulledList.offset,
    delete pulledList.total,
    delete pulledList.href,
    delete pulledList.items;
  const response = await db.collection("Countries").update(
    { countryID: countryID },
    {
      $set: {
        Playlists: pulledList.Playlists,
      },
    }
  );
  res.json(response);
}
