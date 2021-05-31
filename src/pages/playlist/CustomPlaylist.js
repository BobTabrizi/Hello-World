import Head from "next/head";
import styles from "../../styles/CustomPlaylist.module.css";
import Link from "next/link";
import SongButton from "../../components/SongButton";
import Countrycomplete from "../../components/Countrycomplete";
import React, { useState, useEffect } from "react";
export default function CustomPlaylist({ songs }) {
  const [token, setToken] = useState("");
  const [countryOne, setCountryOne] = useState(["", ""]);
  const [countryTwo, setCountryTwo] = useState(["", ""]);
  const [countryThree, setCountryThree] = useState(["", ""]);

  const [countryString, setCountryString] = useState("");
  useEffect(() => {
    let dividerOne = "";
    let dividerTwo = "";
    if (countryOne[1] && countryTwo[1] !== "") dividerOne = "+";
    if (countryTwo[1] && countryThree[1] !== "") dividerTwo = "+";
    if (countryOne[1] && countryThree[1] !== "" && countryTwo[1] === "")
      dividerTwo = "+";
    setCountryString(
      countryOne[1] + dividerOne + countryTwo[1] + dividerTwo + countryThree[1]
    );
  });

  return (
    <>
      <div className={styles.container}>
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <link
            href="https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css"
            rel="stylesheet"
          ></link>
          <link
            href="https://fonts.googleapis.com/css2?family=Codystar&display=swap"
            rel="stylesheet"
          ></link>
        </Head>
      </div>
      <Link href="/">
        <a>
          <div className={styles.returnButton} style={{ fontSize: 20 }}>
            Back to Home
          </div>
        </a>
      </Link>
      <div className={styles.pageHeader}>
        Choose up to 3 countries and get a playlist.
      </div>
      <div className={styles.inputContainer}>
        <div className={styles.inputs}>
          <Countrycomplete searchButton={false} updateCountry={setCountryOne} />
        </div>
        <div className={styles.inputs}>
          <Countrycomplete searchButton={false} updateCountry={setCountryTwo} />
        </div>
        <div className={styles.inputs}>
          <Countrycomplete
            searchButton={false}
            updateCountry={setCountryThree}
          />
        </div>
      </div>
      <div style={{ textAlign: "center" }}>
        <Link href={`/playlist/GeneratedList?countries=${countryString}`}>
          <button className={styles.button}>Make a Customized Playlist</button>
        </Link>
      </div>
    </>
  );
}
