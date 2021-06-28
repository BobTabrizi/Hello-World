import { connectToDatabase } from "../../../util/mongodb";

export default async function handler(req, res) {
  const { db } = await connectToDatabase();

  let genre = req.query.genre;
  const data = await db
    .collection("Countries")
    .aggregate([
      {
        $search: {
          search: {
            query: genre,
            path: ["Playlists.genre"],
          },
        },
      },
      {
        $project: {
          countryID: 1,
        },
      },
    ])
    .toArray();
  res.json(data);
}
