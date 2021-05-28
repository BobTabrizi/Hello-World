import { connectToDatabase } from "../../../util/mongodb";

export default async function handler(req, res) {
  const { db } = await connectToDatabase();

  const id = req.query.id;
  const data = await db
    .collection("testCollection")
    .find({ countryID: id })
    .limit(1)
    .toArray();
  const resData = JSON.parse(JSON.stringify(data));
  res.json(resData);
}
