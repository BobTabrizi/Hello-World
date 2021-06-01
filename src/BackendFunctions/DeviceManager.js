export default function DeviceManager(token, uriArr, trackNumber, href) {
  fetch("https://api.spotify.com/v1/me/player/devices", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  })
    .then((resp) => resp.json())
    .then((response) => {
      let index = 0;
      while (response.devices[index]) {
        if (!response.devices[index].is_restricted) {
          return response.devices[index].id;
        }
      }
    })
    .then((device) => {
      let data = {
        uris: uriArr,
        offset: {
          position: trackNumber,
        },
        position_ms: 0,
      };
      fetch(`https://api.spotify.com/v1/me/player/play?device_id=${device}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      });
    })
    .catch((error) => {
      console.log(error);
      window.open(href, "_blank");
    });
}
