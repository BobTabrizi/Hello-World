import React, { useState, useEffect } from "react";
import Link from "next/link";
import CountryData from "../../Data/Countries.json";
import styles from "../styles/GeneratorButton.module.css";
import Genres from "../../Data/Genres.json";
export default function ReRollButton(props) {
  const [randomCountry, setRandomCountry] = useState("");
  const [randomGenre, setRandomGenre] = useState("");
  const [linkReference, setLinkReference] = useState("/");
  const handleClick = () => {
    if (props.discoverMode === "Country") {
      setRandomCountry("");
      location.replace(linkReference);
    }
    if (props.discoverMode === "Genre") {
      setRandomCountry("");
      location.replace(linkReference);
    }
  };

  useEffect(() => {
    if (props.discoverMode === "Country") {
      let rNum = Math.floor(Math.random() * 233);
      while (CountryData[rNum].code === props.current) {
        rNum = Math.floor(Math.random() * 233);
      }
      setRandomCountry(CountryData[rNum].code);
      setRandomGenre("");
      setLinkReference(`/country/${CountryData[rNum].code}?random=true`);
    }
    if (props.discoverMode === "Genre") {
      let rNum = Math.floor(Math.random() * Genres.length);
      while (Genres[rNum].name === props.current) {
        rNum = Math.floor(Math.random() * Genres.length);
      }
      setRandomGenre(Genres[rNum].name);
      setRandomCountry("");
      setLinkReference(`/genre/${Genres[rNum].name}?random=true`);
    }
  }, []);
  return (
    <>
      <Link href={linkReference}>
        <button onClick={handleClick} className={styles.rerollButton}>
          Try Again
        </button>
      </Link>
    </>
  );
}
