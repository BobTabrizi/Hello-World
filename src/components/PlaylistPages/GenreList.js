import React, { useState } from "react";
import styles from "../../styles/GenrePage.module.css";
import Link from "next/link";
import SkeletonGenreItem from "../../Skeletons/SkeletonListItem";
export default function GenreList(props) {
  return (
    <div className={styles.genreContainer}>
      {!props.countryList &&
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((n) => (
          <div className={styles.skeletonGenreItems} key={n}>
            <SkeletonGenreItem key={n} />
          </div>
        ))}
      <div className={styles.genreContainer}>
        {props.countryList &&
          props.countryList.map((country, index) => (
            <div key={index}>
              <Link
                href={`/playlist/${country.countryID}/?genre=${props.genre}&query=genre`}
              >
                <div className={styles.genreItems}>
                  <img
                    src={`/flags/${country.countryID}.png`}
                    style={{ width: 100, height: 60 }}
                  ></img>
                  <div>{country.countryName}</div>
                </div>
              </Link>
            </div>
          ))}
      </div>
    </div>
  );
}
