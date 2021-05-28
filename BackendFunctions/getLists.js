export default function getLists(countries) {
  const getList = async (countries) => {
    const data = await fetch(`http://localhost:3000/api/${countries}`);
    const resp = await data.json();
    return resp;
  };

  const getcustomList = async (countries) => {
    let Data = [];
    let tmpData;
    let getJson;
    let countryNames = [];
    let numCountries = countries[0].length;
    for (let i = 0; i < numCountries; i++) {
      tmpData = await fetch(`http://localhost:3000/api/${countries[0][i]}`);
      getJson = await tmpData.json();
      countryNames.push(getJson[0].countryName);
      let currTracks = getJson[0].Playlists[0].tracks;

      //Adding country identifiers to each track for future logging/querying.
      for (let j = 0; j < currTracks.length; j++) {
        currTracks[j].countryID = getJson[0].countryID;
      }
      //Truncate arrays to fit all countries in 100 tracks
      if (numCountries === 3) {
        if (currTracks.length > 30) {
          currTracks.length = 30;
        }
      }
      Data.push(currTracks);
    }
    Data.push(countryNames);
    return Data;
  };

  if (countries.length > 1) {
    return getcustomList([countries]);
  } else {
    return getList([countries]);
  }
}
