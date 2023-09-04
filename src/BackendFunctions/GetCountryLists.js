export default async function GetCountryLists(country) {
  const data = await fetch(
    `${process.env.NEXT_PUBLIC_PROD_URL}/api/${country}`
  );

  const response = await data.json();
  return response[0]?.Playlists;
}
