import { connectToDatabase } from "../../../util/mongodb";

export default async function handler(req, res) {
  const { db } = await connectToDatabase();

  let genre = null;
  const id = req.query.id;
  if (req.query.genre) {
    genre = req.query.genre;
  }
  let data;
  let resultData;
  if (genre === null) {
    //For country pages, we only need the playlist images and genre names
    data = await db
      .collection("Countries")
      .aggregate([
        {
          $search: {
            search: {
              query: id,
              path: ["countryID"],
            },
          },
        },
        {
          $project: {
            "Playlists.genre": 1,
            "Playlists.image": 1,
          },
        },
        {
          $limit: 1,
        },
      ])
      .toArray();
  } else {
    //For playlist pages, we need to first get the index of the genre
    let idxFind = await db
      .collection("Countries")
      .aggregate([
        {
          $search: {
            search: {
              query: id,
              path: ["countryID"],
            },
          },
        },
        {
          $project: {
            index: {
              $indexOfArray: ["$Playlists.genre", genre],
            },
          },
        },
      ])
      .toArray();

    //Then with the index, we pull the specific playlist
    let idx = idxFind[0].index;
    data = await db
      .collection("Countries")
      .aggregate([
        {
          $search: {
            search: {
              query: id,
              path: ["countryID"],
            },
          },
        },
        {
          $project: {
            Playlists: { $arrayElemAt: ["$Playlists", idx] },
          },
        },
        {
          $limit: 2,
        },
      ])
      .toArray();
  }

  resultData = JSON.parse(JSON.stringify(data));
  res.json(resultData);
}
