import Data from "../Data.json";
export default function getLists() {
  const getLists = async () => {
    for (var key in Data) {
      const id = Data[key].countryID;
      const url = Data[key].playlists[0].url;
      const data = await fetch(`http://localhost:3000/api/${id}/${url}`);
    }
  };

  return getLists();
}
