import React, { useState } from "react";
import styles from "../styles/PlaylistPage.module.css";
export default function SongButton(props) {
  const [hover, setHover] = useState("none");

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
      className={styles.songImages}
      onMouseEnter={(e) => showPlayButton(e)}
      onMouseLeave={(e) => hidePlayButton(e)}
    >
      <img
        src={props.song.track.album.images[0].url}
        width="250"
        height="250"
        alt="Song Image"
      ></img>
      <button className={styles.reactiveButton} style={{ display: hover }}>
        PLAY BUTTON HERE
      </button>
    </div>
  );
}
