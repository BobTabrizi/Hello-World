import GetToken from "../../BackendFunctions/getToken";
import { connectToDatabase } from "../../../util/mongodb";
export default async function handler(req, res) {
  const { db } = await connectToDatabase();
  const id = req.query.countryID;
  const genre = req.query.genre;

  let artistArray = [];

  artistArray = await getArtists(id, genre);

  let Token = await GetToken();

  let GeneratedArtists = await generateArtists(artistArray, Token);

  let SelectedArtists = PickArtists(GeneratedArtists);

  let Playlist = await getTracks(SelectedArtists, Token, id);
  res.json(Playlist);
}

/*------------------Helper Functions----------- */

const retrieveData = (token, id, DataType) => {
  //Set CountryID to be whatever the user is located in, or US by default.
  let countryID = "US";
  if (DataType === "artists") {
    return new Promise((resolve, reject) => {
      fetch(`https://api.spotify.com/v1/artists/${id}/related-artists`, {
        method: "GET",
        params: { limit: 1 },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          resolve(data);
        });
    });
  } else {
    return new Promise((resolve, reject) => {
      fetch(
        `https://api.spotify.com/v1/artists/${id}/top-tracks?market=${countryID}`,
        {
          method: "GET",
          params: { limit: 1 },
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
  }
};

const getArtists = async (id, genre) => {
  const data = await fetch(
    `${process.env.NEXT_PUBLIC_PROD_URL}/api/${id}?genre=${genre}`
  );
  const resp = await data.json();

  let index;
  for (let i = 0; i < resp[0].Playlists.length; i++) {
    if (resp[0].Playlists[i].genre === genre) {
      index = i;
    }
  }
  const source = resp[0].Playlists[index];
  let artistArray = [];
  for (let i = 0; i < source.tracks.length; i++) {
    if (!artistArray.includes(source.tracks[i].track.artists[0].id)) {
      artistArray.push(source.tracks[i].track.artists[0].id);
    }
  }
  return artistArray;
};

const generateArtists = async (Artists, token) => {
  let ArtistData = [];

  for (let i = 0; i < Artists.length; i++) {
    ArtistData.push(retrieveData(token, Artists[i], "artists"));
  }

  let NewArtists = await Promise.all(ArtistData).then((Data) => {
    let ArtistList = [];
    for (let i = 0; i < Data.length; i++) {
      for (let j = 0; j < Data[i].artists.length; j++) {
        ArtistList.push(Data[i].artists[j].id);
      }
    }
    return ArtistList;
  });

  return NewArtists;
};

const getTracks = async (Artists, token, id) => {
  let tempData = [];

  for (let i = 0; i < Artists.length; i++) {
    tempData.push(retrieveData(token, Artists[i], "tracks"));
  }
  let tracks = await Promise.all(tempData).then((Data) => {
    let trackArray = [];
    for (let j = 0; j < Data.length; j++) {
      for (let k = 0; k < Data[j].tracks.length; k++) {
        Data[j].tracks[k].countryID = id;
        trackArray.push(Data[j].tracks[k]);
      }
    }
    return trackArray;
  });
  return tracks;
};

const PickArtists = (Artists) => {
  let SelectedArtists = [];
  //Randomly pull 10 artists from our generated Artists.
  const numbers = Array(Artists.length)
    .fill()
    .map((_, index) => index + 1);
  numbers.sort(() => Math.random() - 0.5);
  let idx = numbers.slice(0, 10);
  for (let i = 0; i < idx.length; i++) {
    SelectedArtists.push(Artists[idx[i]]);
  }
  return SelectedArtists;
};
