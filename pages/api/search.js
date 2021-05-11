import { connectToDatabase } from "../../util/mongodb";

export default async function handler(req, res) {
  const { db } = await connectToDatabase();

  const data = await db
    .collection("Playlists")
    .aggregate([
      {
        $search: {
          search: {
            query: req.query.term,
            path: ["countryID"],
          },
        },
      },
      {
        $project: {
          items: 1,
        },
      },
      {
        $limit: 1,
      },
    ])
    .toArray();

  res.json(data);
}
