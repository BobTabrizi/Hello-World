export default async function CreateList(countries, listType, songs) {
  let uriArray = [];
  for (let i = 0; i < songs.length; i++) {
    uriArray.push(songs[i].track.uri);
  }
  let tempToken = localStorage.getItem("Token");

  let userData = await getuserData(tempToken);
  let data;
  if (listType === "random") {
    data = {
      name: "Random Playlist",
      description: `${countries}`,
      public: true,
    };
  } else {
    data = {
      name: "Custom Playlist",
      description: `${countries}`,
      public: true,
    };
  }

  const Playlist = await makePlaylist(userData, tempToken, data);
  PopulateLists(Playlist, tempToken, uriArray);
  return Playlist.external_urls.spotify;
}

const getuserData = async (tempToken) => {
  let userData = await fetch("https://api.spotify.com/v1/me/", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${tempToken}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  })
    .then((resp) => resp.json())
    .then((response) => {
      return response;
    });
  return userData;
};

const makePlaylist = async (userData, tempToken, data) => {
  let Playlist = await fetch(
    `https://api.spotify.com/v1/users/${userData.id}/playlists`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tempToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data),
    }
  )
    .then((resp) => resp.json())
    .then((response) => {
      return response;
    });
  return Playlist;
};

const PopulateLists = async (PlaylistData, tempToken, uriArray) => {
  fetch(`https://api.spotify.com/v1/playlists/${PlaylistData.id}/tracks`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${tempToken}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(uriArray),
  });
};
