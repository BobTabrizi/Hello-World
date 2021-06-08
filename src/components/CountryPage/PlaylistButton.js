import React, { useState } from "react";
import styles from "../../styles/PlaylistPage.module.css";
import DeviceManager from "../../BackendFunctions/DeviceManager";
import Link from "next/link";
export default function SongButton(props) {
  const [hover, setHover] = useState("none");
  const handleButtonClick = async () => {};

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
        src={"/SpotifyPlaceHolder.jpg"}
        width="300"
        height="300"
        alt="Song Image"
      ></img>
      <Link href={`/playlist/${props.countryID}?genre=${props.genre}`}>
        <button
          onClick={() => handleButtonClick()}
          className={styles.reactiveButton}
          style={{ display: hover }}
        >
          <img height="100%" width="100%" src="/SpotifyButton.png"></img>
        </button>
      </Link>
    </div>
  );
}
