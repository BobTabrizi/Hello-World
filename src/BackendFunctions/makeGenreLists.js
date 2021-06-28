//import GenreList from "../../Data/GenreList.json";
import CountryList from "../../Data/CountryGenreList.json";
import GetToken from "./getToken";
export default async function MakeGenreLists(genre) {
  let Token = await GetToken();

  for (let i = 0; i < CountryList.length; i++) {
    for (let j = 0; j < CountryList[i].playlists.length; j++) {
      const data = await fetch(
        `${process.env.NEXT_PUBLIC_PROD_URL}/api/makeGenreLists?genre=${CountryList[i].playlists[j].genre}&subgenre=${CountryList[i].playlists[j].subgenre}&countryID=${CountryList[i].countryID}&token=${Token}`
      );
      await sleep(8000);
    }
    await sleep(20000);
  }

  return "TMP";
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
