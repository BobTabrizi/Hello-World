import Data from "../../Data/Data.json";
//import Data from "../../Data/ExternalData.json";
export default function popLists() {
  const getLists = async () => {
    fetch(`${process.env.NEXT_PUBLIC_PROD_URL}/api/refreshLists`);
  };

  return getLists();
}
