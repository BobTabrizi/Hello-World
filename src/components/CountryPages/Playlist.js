import React, { useState } from "react";
import styles from "../../styles/CountryPage.module.css";
import SkeletonListItem from "../../Skeletons/SkeletonListItem";
import PlaylistButton from "./PlaylistButton";
export default function Playlist(props) {
  return (
    <div className={styles.listContainer}>
      {!props.lists &&
        [1, 2, 3, 4].map((n) => (
          <div className={styles.skeletonListItems} key={n}>
            <SkeletonListItem key={n} />
          </div>
        ))}
      {props.lists &&
        props.lists.map((list, index) => (
          <div className={styles.songItems} key={index}>
            <PlaylistButton
              image={list.image}
              countryID={props.countryID}
              genre={list.genre}
              randomSearchMode={props.randomSearchMode}
            />
          </div>
        ))}
    </div>
  );
}
