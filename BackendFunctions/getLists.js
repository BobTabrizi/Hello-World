import Data from "../Data.json";
//import Data from "../ExternalData.json";
export default function getLists() {
  const getLists = async () => {
    //   for (var key in Data) {
    const id = Data[3].countryID;
    const url = Data[3].playlists[0].url;
    const data = await fetch(`http://localhost:3000/api/${id}/${url}`);
  };
  //  };

  return getLists();
}
