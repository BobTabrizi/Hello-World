export default function CreateList(countries, songs) {
  let uriArray = [];
  for (let i = 0; i < songs.length; i++) {
    uriArray.push(songs[i].track.uri);
  }
  let tempToken = localStorage.getItem("Token");
  console.log(tempToken);
  fetch("https://api.spotify.com/v1/me/", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${tempToken}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  })
    .then((resp) => resp.json())
    .then((response) => {
      let data;
      console.log(response.id);
      if (countries === "Random Countries") {
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

      fetch(`https://api.spotify.com/v1/users/${response.id}/playlists`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tempToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((resp) => resp.json())
        .then((response) => {
          fetch(`https://api.spotify.com/v1/playlists/${response.id}/tracks`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${tempToken}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify(uriArray),
          });
        });
    });
}
