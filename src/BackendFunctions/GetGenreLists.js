export default async function GetGenreLists(genre) {
  const data = await fetch(
    `${process.env.NEXT_PUBLIC_PROD_URL}/api/getGenre?genre=${genre}`
  );
  const response = await data.json();

  return response;
}
