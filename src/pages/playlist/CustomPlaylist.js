import Head from "next/head";
import styles from "../../styles/CustomPlaylist.module.css";
import Link from "next/link";
import Countrycomplete from "../../components/Countrycomplete";
import Header from "../../components/PlaylistPages/Header";
import React, { useState, useEffect } from "react";
import { config, dom } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;
export default function CustomPlaylist({ songs }) {
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
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
        ></link>
        <style>{dom.css()}</style>
      </Head>
      <div className={styles.container}>
        <Header pageType={"CustomInput"} />
        <div className={styles.inputContainer}>
          <div className={styles.inputs}>
            <Countrycomplete
              searchButton={false}
              updateCountry={setCountryOne}
              searchType={"Country"}
            />
          </div>
          <div className={styles.inputs}>
            <Countrycomplete
              searchButton={false}
              updateCountry={setCountryTwo}
              searchType={"Country"}
            />
          </div>
          <div className={styles.inputs}>
            <Countrycomplete
              searchButton={false}
              updateCountry={setCountryThree}
              searchType={"Country"}
            />
          </div>
        </div>
        <div style={{ textAlign: "center" }}>
          <Link href={`/playlist/GeneratedList?countries=${countryString}`}>
            <button className={styles.button}>
              Make a Customized Playlist
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}
