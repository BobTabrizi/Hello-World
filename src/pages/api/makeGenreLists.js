import { connectToDatabase } from "../../../util/mongodb";
import AWSData from "../../../Data/AWSData.json";
export default async function handler(req, res) {
  /*
  const { db } = await connectToDatabase();
  let queryParam = "genre:" + JSON.stringify(req.query.subgenre);
  let id = req.query.countryID;
  let Token = req.query.token;
  queryParam = encodeURIComponent(queryParam);
  let AWS_Image =
    `${process.env.NEXT_PUBLIC_AWS_URL}/` + AWSData[req.query.genre];
  //CALL SPOTIFY SEARCH API ENDPOINT HERE AND MAKE THE PLAYLISTS.
  let responseTemp = await fetch(
    `https://api.spotify.com/v1/search?q=${queryParam}&type=artist&limit=50`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${Token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }
  );

  const artistData = await responseTemp.json();
  if (artistData.artists.total > 50) {
    //Maybe do something here with offset
  }
  //Goal is to get 100 different artists if possible.
  //If the returned length is more than 50, Run a second query with offset of 50 to get the last 50 of the 100.
  //Once all artists are obtained, take their 5 top songs and shuffle them randomly. Pick 100 songs out of the potential tracks.
  //Once the playlist is created, store the playlist with its corresponding genre tag in DB.
  let Playlist = await getTracks(artistData.artists.items, Token, id);
  let ArrObject = {};
  ArrObject.genre = req.query.genre;
  ArrObject.subgenre = req.query.subgenre;
  ArrObject.totalTracks = Playlist.length;
  ArrObject.tracks = Playlist;
  ArrObject.image = AWS_Image;

  console.log(id + " " + req.query.subgenre);
  await db.collection("Countries").update(
    { countryID: id },
    {
      $push: {
        Playlists: ArrObject,
      },
    },
    { upsert: true }
  );

  */
  //res.json(Playlist);

  res.json("N/A");
}

/*---------------Helper Functions -----------------------------*/

const retrieveData = (token, id) => {
  //Set CountryID to be whatever the user is located in, or US by default.
  let countryID = "US";

  return new Promise((resolve, reject) => {
    fetch(
      `https://api.spotify.com/v1/artists/${id}/top-tracks?market=${countryID}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        resolve(data);
      });
  });
};

//Distribute new tracks using Fisher Yates Shuffle
const shuffleData = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const getTracks = async (Artists, token, id) => {
  let tempData = [];

  for (let i = 0; i < Artists.length; i++) {
    tempData.push(retrieveData(token, Artists[i].id));
  }
  let tracks = await Promise.all(tempData).then((Data) => {
    let trackArray = [];
    for (let j = 0; j < Data.length; j++) {
      for (let k = 0; k < Data[j].tracks.length; k++) {
        Data[j].tracks[k].countryID = id;
        trackArray.push({
          track: Data[j].tracks[k],
          countryID: id,
        });
      }
    }
    trackArray = shuffleData(trackArray);
    if (trackArray.length > 100) trackArray.length = 100;
    return trackArray;
  });
  return tracks;
};
