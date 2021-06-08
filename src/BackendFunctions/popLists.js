import Data from "../../Data/Data.json";
//import Data from "../../Data/ExternalData.json";
export default function popLists() {
  /*
  const getLists = async () => {
    fetch(`${process.env.NEXT_PUBLIC_PROD_URL}/api/refreshLists`);
  };

  return getLists();
  */
  const getLists = async () => {
    //  for (var key in Data) {
    for (let i = 0; i < Data.length; i++) {
      const id = Data[i].countryID;
      console.log(id);
      // const url = Data[2].playlists[1].url;
      const data = await fetch(
        `${process.env.NEXT_PUBLIC_PROD_URL}/api/${id}/tempPopLists?Number=${i}`
      );
    }
  };

  return getLists();
}
