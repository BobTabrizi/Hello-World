import React, { useState } from "react";
import styles from "../../styles/PlaylistPage.module.css";
import Link from "next/link";
import SpotifyButton from "../../components/PlaylistPages/SpotifyViewButton";
export default function Header(props) {
  let subHeaderComponent;
  switch (props.pageType) {
    case "Country":
      subHeaderComponent = (
        <div style={{ marginTop: "1.5rem" }}>{props.countryName}</div>
      );
      break;

    case "Genre":
      subHeaderComponent = (
        <div style={{ marginTop: "1.5rem" }}>{props.genre}</div>
      );
      break;

    case "Random":
      subHeaderComponent = (
        <>
          <div style={{ marginTop: "1.5rem" }}>Random Playlist</div>
          <SpotifyButton playlistUrl={props.playlistUrl} />
        </>
      );
      break;

    case "Custom":
      subHeaderComponent = (
        <>
          <div style={{ marginTop: "1.5rem" }}>Custom Playlist</div>
          <SpotifyButton playlistUrl={props.playlistUrl} />
        </>
      );
      break;

    case "Playlist":
      let returnComponent;
      returnComponent = HandlePlaylistReturn(props.properties);
      subHeaderComponent = (
        <>
          {returnComponent}
          <div style={{ marginTop: "1.5rem" }}>
            {props.properties.genre} in {props.properties.countryName}
          </div>
        </>
      );
      break;

    case "CustomInput":
      subHeaderComponent = (
        <div style={{ marginTop: "1rem", fontSize: 40 }}>
          Choose up to 3 countries and get a playlist
        </div>
      );
      break;
  }

  return (
    <div className={styles.playlistHeader} style={{ fontSize: 70 }}>
      <div>
        <Link href="/">
          <a>
            <button className={styles.returnButton} style={{ fontSize: 20 }}>
              Return to main page
            </button>
          </a>
        </Link>
      </div>
      {subHeaderComponent}
    </div>
  );
}

/*--------------------Helper Functions ------------------------*/

//Helper function to determine the return button route on playlist page
const HandlePlaylistReturn = (properties) => {
  let ButtonComponent;
  let modeParam = "";
  if (properties.queryMethod === "genre") {
    if (properties.queryMode === "random") {
      modeParam = "?random=true";
    }
    ButtonComponent = (
      <div>
        <Link href={`/genre/${properties.genre}${modeParam}`}>
          <a>
            <button className={styles.returnButton} style={{ fontSize: 18 }}>
              Return to {properties.genre} Countries
            </button>
          </a>
        </Link>
      </div>
    );
  } else {
    if (properties.queryMode === "random") {
      modeParam = "?random=true";
    }
    ButtonComponent = (
      <div>
        <Link href={`/country/${properties.countryID}${modeParam}`}>
          <a>
            <button className={styles.returnButton} style={{ fontSize: 18 }}>
              Return to {properties.countryName}
            </button>
          </a>
        </Link>
      </div>
    );
  }
  return ButtonComponent;
};
