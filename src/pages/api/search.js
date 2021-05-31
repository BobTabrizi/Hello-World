import { connectToDatabase } from "../../../util/mongodb";

export default async function handler(req, res) {
  const { db } = await connectToDatabase();

  const data = await db
    .collection("Countries")
    .aggregate([
      {
        $search: {
          search: {
            query: req.query.term,
            path: ["countryID", "countryName"],
          },
        },
      },
      {
        $project: {
          items: 2,
        },
      },
      {
        $limit: 2,
      },
    ])
    .toArray();

  res.json(data);
}
