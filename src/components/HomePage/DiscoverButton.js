import React, { useState, useEffect } from "react";
import Link from "next/link";
import CountryData from "../../../Data/Countries.json";
import styles from "../../styles/GeneratorButton.module.css";
import Genres from "../../../Data/Genres.json";
export default function DiscoverButton(props) {
  const [randomCountry, setRandomCountry] = useState("");
  const [randomGenre, setRandomGenre] = useState("");
  const [linkReference, setLinkReference] = useState("/");
  useEffect(() => {
    if (randomCountry === "" && props.discoverMode === "Country") {
      let rNum = Math.floor(Math.random() * 243);
      setRandomCountry(CountryData[rNum].code);
      setRandomGenre("");
      setLinkReference(`country/${CountryData[rNum].code}?random=true`);
    }

    if (randomGenre === "" && props.discoverMode === "Genre") {
      let rNum = Math.floor(Math.random() * Genres.length);
      setRandomGenre(Genres[rNum].name);
      setRandomCountry("");
      setLinkReference(`genre/${Genres[rNum].name}?random=true`);
    }
  });
  return (
    <>
      <Link href={linkReference}>
        <button className={styles.button}>I'm feeling adventurous</button>
      </Link>
    </>
  );
}
