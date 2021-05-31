import { connectToDatabase } from "../../../../util/mongodb";
export default async function handler(req, res) {
  const { db } = await connectToDatabase();
  const data = await db.collection("Countries").findOneAndUpdate(
    { countryID: req.query.countryID },
    {
      $inc: {
        "Data.searchCountries.songPlays": 1,
      },
    },
    { remove: false }
  );

  res.json(data);
}
