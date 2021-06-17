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
  if (genre !== null) {
    data = await db
      .collection("Countries")
      .find({ countryID: id })
      .limit(1)
      .toArray();
    resultData = JSON.parse(JSON.stringify(data));
  } else {
    data = await db
      .collection("Countries")
      .find({ countryID: id })
      .limit(1)
      .toArray();
    resultData = JSON.parse(JSON.stringify(data));
  }
  res.json(resultData);
}
