import React, { useState } from "react";
import styles from "../styles/PlaylistPage.module.css";
import SongButton from "../components/SongButton";
import SkeletonSongItem from "../Skeletons/SkeletonSongItem";
export default function SongList(props) {
  return (
    <div className={styles.songContainer}>
      {!props.songs &&
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
          <div className={styles.skeletonSongItems} key={n}>
            <SkeletonSongItem key={n} />
          </div>
        ))}
      {props.songs &&
        props.songs.map((song, index) => (
          <div className={styles.songItems} key={index}>
            <SongButton
              song={song}
              uriArray={props.uriArray}
              index={index}
              token={props.token}
              logUrl={props.logUrl}
            />
            <div className={styles.songDetails}>
              <div className={styles.trackName}>{song.track.name}</div>
              <div className={styles.artistName}>
                {song.track.artists[0].name}
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}
