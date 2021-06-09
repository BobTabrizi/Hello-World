import { connectToDatabase } from "../../../../util/mongodb";
import Data from "../../../../Data/Data.json";

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

const cleanData = (pulledList, url, countryID, playlistType) => {
  let imgSrc;

  pulledList.items = pulledList.items.filter(
    (trackItem) => trackItem.is_local !== true && trackItem.track !== null
  );
  let totalTracks = pulledList.items.length;
  pulledList = {
    genre: playlistType,
    url: url,
    href: pulledList.href,
    totalTracks: pulledList.items.length,
    spotifyOwned: true,
    tracks: pulledList.items,
    image: imgSrc,
  };

  // console.log(pulledList.tracks[2]);
  for (let i = 0; i < totalTracks; i++) {
    pulledList.tracks[i].countryID = countryID;
  }
  delete pulledList.limit,
    delete pulledList.next,
    delete pulledList.previous,
    delete pulledList.offset,
    delete pulledList.total,
    delete pulledList.href,
    delete pulledList.items;

  return pulledList;
};

export default async function handler(req, res) {
  const { db } = await connectToDatabase();
  const countryID = req.query.id;
  let response;
  //Array number to access data.
  const DataNumber = req.query.Number;
  const numLists = Data[DataNumber].playlists.length;

  let urlArray = [];
  for (let i = 0; i < numLists; i++) {
    urlArray.push(Data[DataNumber].playlists[i].url);
  }

  let token = await setAccessToken();

  let pulledArray = [];
  for (let i = 0; i < urlArray.length; i++) {
    let Type = Data[DataNumber].playlists[i].type;

    let temp = await getSongs(token, urlArray[i]);
    temp = cleanData(temp, urlArray[i], countryID, Type);
    pulledArray.push(temp);
  }

  response = await db.collection("testCollection").update(
    { countryID: countryID },
    {
      $set: {
        Playlists: pulledArray,
      },
    }
  );
  res.json(response);
}
