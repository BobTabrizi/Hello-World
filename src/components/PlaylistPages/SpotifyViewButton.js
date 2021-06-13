import React, { useState, useEffect } from "react";
import styles from "../../styles/PlaylistPage.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpotify } from "@fortawesome/free-brands-svg-icons";
export default function SpotifyViewButton(props) {
  return (
    <a href={props.playlistUrl} target="_blank">
      <button
        className={styles.spotifyLink}
        style={{
          fontSize: 18,
          textAlign: "center",
        }}
      >
        <FontAwesomeIcon
          icon={faSpotify}
          style={{
            marginRight: 10,
            color: "#1DB954",
            verticalAlign: "middle",
          }}
          size="2x"
        ></FontAwesomeIcon>
        View it on Spotify
      </button>
    </a>
  );
}
