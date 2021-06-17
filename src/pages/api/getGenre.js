import Data from "../../../Data/Data.json";
import GetToken from "../../BackendFunctions/getToken";
import { connectToDatabase } from "../../../util/mongodb";
const retrieveData = (url, token, id) => {
  return new Promise((resolve, reject) => {
    fetch(`https://api.spotify.com/v1/playlists/${url}`, {
      method: "GET",
      params: { limit: 1 },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        for (let i = 0; i < data.tracks.items.length; i++) {
          data.tracks.items[i].countryID = id;
        }
        data.tracks.countryID = id;
        data.tracks.url = url;

        /*Edge case handling for locality/null track data (for non official lists)
        data.tracks.items = data.tracks.items.filter(
          (trackItem) => trackItem.is_local !== true && trackItem.track !== null
        );
        */
        resolve(data.tracks);
      });
  });
};

const cleanData = (pulledList) => {
  for (let i = 0; i < pulledList.length; i++) {
    pulledList[i].Playlists = [
      {
        genre: "Popular",
        url: pulledList[i].url,
        href: pulledList[i].href,
        totalTracks: pulledList[i].items.length,
        spotifyOwned: true,
        tracks: pulledList[i].items,
      },
    ];
    delete pulledList[i].limit,
      delete pulledList[i].next,
      delete pulledList[i].previous,
      delete pulledList[i].offset,
      delete pulledList[i].total,
      delete pulledList[i].href,
      delete pulledList[i].items,
      delete pulledList[i].url;
  }
  return pulledList;
};
const getSongs = async (token) => {
  let playlistData = [];
  for (var key in Data) {
    const id = Data[key].countryID;
    const url = Data[key].playlists[0].url;
    playlistData.push(retrieveData(url, token, id));
  }
  let Playlists = await Promise.all(playlistData).then((Data) => {
    return Data;
  });
  return Playlists;
};

export default async function handler(req, res) {
  const { db } = await connectToDatabase();

  let pulledList = await GetToken()
    .then((token) => {
      return getSongs(token);
    })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.log(error);
    });

  pulledList = cleanData(pulledList);

  let status = "Lists Successfully Updated";
  for (var item in pulledList) {
    db.collection("Countries")
      .update(
        { countryID: pulledList[item].countryID },
        {
          $set: {
            Playlists: pulledList[item].Playlists,
          },
        }
      )
      .catch((err) => (status = err));
  }

  res.json(status);
}
