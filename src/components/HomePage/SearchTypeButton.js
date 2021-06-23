import React, { useState, useEffect } from "react";
import styles from "../../styles/GeneratorButton.module.css";
export default function SearchTypeButton(props) {
  const [countryButtonStatus, setCountryButtonStatus] = useState(true);
  const [genreButtonStatus, setGenreButtonStatus] = useState(false);
  const handleClick = (type) => {
    let currStatus = props.searchStatus;
    if (type !== currStatus) {
      props.updateSearchMode(type);
      props.updateGenreState(true);
    }
  };
  return (
    <>
      <button
        className={styles.typeButton}
        style={{
          fontSize: 14,
          borderColor: countryButtonStatus ? "green" : "white",
          color: countryButtonStatus ? "green" : "white",
        }}
        onClick={() => {
          handleClick("Country");
          setCountryButtonStatus(true);
          setGenreButtonStatus(false);
        }}
      >
        Country
      </button>
      <button
        className={styles.typeButton}
        style={{
          fontSize: 14,
          marginLeft: 5,
          borderColor: genreButtonStatus ? "green" : "white",
          color: genreButtonStatus ? "green" : "white",
        }}
        onClick={() => {
          handleClick("Genre");
          setCountryButtonStatus(false);
          setGenreButtonStatus(true);
        }}
      >
        Genre
      </button>
    </>
  );
}
