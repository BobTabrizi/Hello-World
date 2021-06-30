import React, { useState } from "react";
import styles from "../../styles/PlaylistPage.module.css";
export default function Refresh(props) {
  const handleRefresh = async () => {
    props.updateSongs(null);
    props.updateURI([]);
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    let trackURI = [];

    const data = await fetch(
      `${process.env.NEXT_PUBLIC_PROD_URL}/api/PlaylistGenerator?countryID=${props.countryID}&genre=${props.genre}`
    );
    const resp = await data.json();
    for (let i = 0; i < resp.length; i++) {
      trackURI.push(resp[i].uri);
    }

    const tracks = resp.map((track) => {
      return {
        countryID: track.countryID,
        track: track,
      };
    });
    props.updateURI(trackURI);
    props.updateSongs(tracks);
  };

  //Only render on country specific genres
  if (props.genre !== "popular") {
    return (
      <>
        <div
          style={{
            textAlign: "center",
            paddingBottom: "2%",
            fontSize: 19,
          }}
        >
          <button className={styles.refreshButton} onClick={handleRefresh}>
            Refresh
          </button>
        </div>
      </>
    );
  } else {
    return null;
  }
}
