import Countries from "../../../Data/Countries.json";
import { connectToDatabase } from "../../../util/mongodb";

export default async function handler(req, res) {
  const { db } = await connectToDatabase();

  let status;
  let rNum = Math.floor(Math.random() * Countries.length);
  let selectedCountry = Countries[rNum].code;
  status = selectedCountry;
  db.collection("CountryFeature")
    .update({ EventType: "COTD" }, { $set: { country: selectedCountry } })
    .catch((err) => (status = err));

  res.json(status);
}
