import Data from "../../Data/Data.json";
//import Data from "../../Data/ExternalData.json";
export default function popLists() {
  const getLists = async () => {
    // for (var key in Data) {
    //   const id = Data[key].countryID;
    //    const url = Data[key].playlists[0].url;
    //   fetch(`http://localhost:3000/api/${id}/${url}`);
    //   }
    fetch(`${process.env.VERCEL_URL}/api/refreshLists`);
  };

  return getLists();
}
