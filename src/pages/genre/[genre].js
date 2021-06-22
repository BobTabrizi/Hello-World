import Head from "next/head";
import styles from "../../styles/GenrePage.module.css";
import Link from "next/link";
import countryMap from "../../../Data/countryMap";
import { connectToDatabase } from "../../../util/mongodb";
import React, { useState, useEffect } from "react";
import GetCountryByGenre from "../../BackendFunctions/GetGenreLists";

export default function Country(props) {
  const [token, setToken] = useState("");
  const [tokenState, setTokenState] = useState(false);
  useEffect(async () => {
    /*
    setTokenState(true);
    if (!tokenState) {
      let token = await fetch(
        `${process.env.NEXT_PUBLIC_PROD_URL}/api/auth/getToken?Type=Anon`
      );
      let tokenData = await token.json();
      // const countryList = await GetGenreLists(genre);
      setCountries(countryList);
    }
    */
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
          <link rel="preconnect" href="https://fonts.gstatic.com"></link>
          <link
            href="https://fonts.googleapis.com/css2?family=Codystar&display=swap"
            rel="stylesheet"
          ></link>
        </Head>

        <div className={styles.playlistHeader} style={{ fontSize: 70 }}>
          <div>
            <Link href="/">
              <a>
                <button
                  className={styles.returnButton}
                  style={{ fontSize: 20 }}
                >
                  Return to main page
                </button>
              </a>
            </Link>
          </div>
          <div></div>
          <div style={{ marginTop: "1.5rem" }}>{props.genre}</div>
        </div>

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
    </>
  );
}

export async function getServerSideProps(context) {
  const { db } = await connectToDatabase();
  let genreName = context.query.genre;
  let countryArray = await GetCountryByGenre(genreName);
  for (let i = 0; i < countryArray.length; i++) {
    countryArray[i].countryName = countryMap[countryArray[i].countryID];
  }

  return {
    props: {
      countryList: countryArray,
      genre: genreName,
    },
  };
}
