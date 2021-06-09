import React, { useState } from "react";
import styles from "../../styles/PlaylistPage.module.css";
import DeviceManager from "../../BackendFunctions/DeviceManager";
export default function SongButton(props) {
  const [hover, setHover] = useState("none");

  const handleButtonClick = async () => {
    fetch(
      `${process.env.NEXT_PUBLIC_PROD_URL}${props.logUrl}${props.song.countryID}`
    );
    DeviceManager(
      props.token,
      props.uriArray,
      props.index,
      props.song.track.external_urls.spotify
    );
  };

  const showPlayButton = (e) => {
    e.preventDefault();

    setHover("block");
  };
  const hidePlayButton = (e) => {
    e.preventDefault();
    setHover("none");
  };

  return (
    <div
      className={styles.songButton}
      onMouseEnter={(e) => showPlayButton(e)}
      onMouseLeave={(e) => hidePlayButton(e)}
    >
      <img
        src={props.song.track.album.images[0].url}
        width="250"
        height="250"
        alt="Song Image"
      ></img>
      <button
        onClick={() => handleButtonClick()}
        className={styles.reactiveButton}
        style={{ display: hover }}
      >
        <img height="100%" width="100%" src="/SpotifyButton.png"></img>
      </button>
    </div>
  );
}
