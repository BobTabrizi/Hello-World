export default function getLists(countries, isRandom, isCustom, genre) {
  if (isRandom === true) {
    return getRandomList(countries);
  } else if (isCustom === true) {
    return getCustomList([countries]);
  } else {
    return getList([countries], genre);
  }
}

/* ----- Helper Functions --------   */
const retrieveData = (url) => {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        resolve(data);
      });
  });
};

const DataProcessor = (allData) => {
  let combinedList = [];
  for (let j = 0; j < allData.length; j++) {
    let currentCountry = allData[j][0];
    let countryName = currentCountry.countryName;
    let tracks = currentCountry.Playlists[0].tracks;

    for (let x = 0; x < 10; x++) {
      let playListLength = tracks.length;
      let rNum = Math.floor(Math.random() * (playListLength - 1));
      let songName = tracks[rNum].track.name;
      //Handling Potential duplicate tracks.
      if (
        combinedList.filter((item) => item.track.name === songName).length !== 0
      ) {
        let shiftFactor = 0;
        if (rNum < playListLength) shiftFactor = 1;
        else if (rNum >= playListLength) {
          shiftFactor = -1;
        }

        tracks[rNum + shiftFactor].countryID = countryName;
        combinedList.push(tracks[rNum + shiftFactor]);
        continue;
      }
      combinedList.push(tracks[rNum]);
    }
  }
  return combinedList;
};

const getList = async (countries, genre) => {
  const data = await fetch(
    `${process.env.NEXT_PUBLIC_PROD_URL}/api/${countries}?genre=${genre}`
  );
  const resp = await data.json();
  return resp;
};

const getCustomList = async (countries) => {
  let Data = [];
  let tmpData;
  let getJson;
  let countryNames = [];
  let numCountries = countries[0].length;
  for (let i = 0; i < numCountries; i++) {
    tmpData = await fetch(
      `${process.env.NEXT_PUBLIC_PROD_URL}/api/${countries[0][i]}`
    );
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

const getRandomList = async (countries) => {
  let playlistRequests = [];

  for (let i = 0; i < countries.length; i++) {
    playlistRequests.push(
      retrieveData(`${process.env.NEXT_PUBLIC_PROD_URL}/api/${countries[i]}`)
    );
  }
  let processedData = await Promise.all(playlistRequests).then((allData) => {
    let data = DataProcessor(allData);
    return data;
  });
  return processedData;
};
