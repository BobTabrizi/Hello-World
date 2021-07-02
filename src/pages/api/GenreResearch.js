import GetToken from "../../BackendFunctions/getToken";
export default async function handler(req, res) {
  let queryParam = "genre:" + JSON.stringify(req.query.queryItem);
  let Token = await GetToken();
  let arrayHolder = [];
  let numResults;
  let data;

  let response = await fetch(
    `https://api.spotify.com/v1/search?q=${queryParam}&type=artist&limit=50`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${Token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }
  );
  data = await response.json();
  numResults = data.artists.total;
  for (let j = 0; j < data.artists.items.length; j++) {
    for (let k = 0; k < data.artists.items[j].genres.length; k++) {
      if (!arrayHolder.includes(data.artists.items[j].genres[k])) {
        arrayHolder.push(data.artists.items[j].genres[k]);
      }
    }
  }
  for (let i = 0; i < 350; i = i + 50) {
    let loopedResponse = await fetch(
      `https://api.spotify.com/v1/search?q=${queryParam}&type=artist&limit=50&offset=${i}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${Token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    data = await loopedResponse.json();

    for (let j = 0; j < data.artists.items.length; j++) {
      for (let k = 0; k < data.artists.items[j].genres.length; k++) {
        if (!arrayHolder.includes(data.artists.items[j].genres[k])) {
          arrayHolder.push(data.artists.items[j].genres[k]);
        }
      }
    }
  }
  //console.log(arrayHolder);
  res.json(arrayHolder);
}
