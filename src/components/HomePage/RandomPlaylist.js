import React, { useState, useEffect } from "react";
import Link from "next/link";
import CountryData from "../../../Data/Countries";
import styles from "../../styles/GeneratorButton.module.css";
export default function randomPlaylist() {
  const [randomCountry, setRandomCountry] = useState("NO");
  const [token, setToken] = useState("");

  useEffect(() => {
    if (token === "") {
      let rNum = Math.floor(Math.random() * 233);
      setRandomCountry(CountryData[rNum].code);
    }
    let tempToken = localStorage.getItem("Token");
    setToken(tempToken);
  });

  if (token === null || token.length === 0) {
    return null;
  } else if (token.length > 1) {
    return (
      <>
        <Link href={`/playlist/random`}>
          <button className={styles.button}>Make a Random Playlist</button>
        </Link>
      </>
    );
  }
}
