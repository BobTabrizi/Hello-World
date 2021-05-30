import Data from "../../Data/Data.json";
//import Data from "../../Data/ExternalData.json";
export default function popLists() {
  const getLists = async () => {
    //  for (var key in Data) {
    const id = Data[2].countryID;
    const url = Data[2].playlists[0].url;
    const data = await fetch(
      `https://hello-world-bobtabrizi.vercel.app/api/${id}/${url}`
    );
    //  }
  };

  return getLists();
}
