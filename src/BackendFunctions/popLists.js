export default function popLists() {
  const getLists = async () => {
    fetch(`${process.env.NEXT_PUBLIC_PROD_URL}/api/refreshLists`);
  };

  return getLists();
}
