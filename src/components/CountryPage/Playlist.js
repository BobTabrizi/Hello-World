import React, { useState } from "react";
import styles from "../../styles/CountryPage.module.css";
import SkeletonSongItem from "../../Skeletons/SkeletonSongItem";
import PlaylistButton from "./PlaylistButton";
export default function Playlist(props) {
  return (
    <div className={styles.songContainer}>
      {!props.lists &&
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
          <div className={styles.skeletonSongItems} key={n}>
            <SkeletonSongItem key={n} />
          </div>
        ))}
      {props.lists &&
        props.lists.map((list, index) => (
          <div className={styles.songItems} key={index}>
            <PlaylistButton countryID={props.countryID} genre={list.genre} />
            <div className={styles.songDetails}>
              <div className={styles.trackName} style={{ fontSize: 30 }}>
                {list.genre}
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}
