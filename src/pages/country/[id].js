import Head from "next/head";
import styles from "../../styles/CountryPage.module.css";
import React, { useState, useEffect } from "react";
import countryMap from "../../../Data/countryMap.json";
import GetCountryLists from "../../BackendFunctions/GetCountryLists";
import Playlist from "../../components/CountryPages/Playlist";
import Header from "../../components/PlaylistPages/Header";
export default function Country({ countryID, countryName }) {
  const [playlists, setPlaylists] = useState(null);
  useEffect(async () => {
    if (!playlists) {
      const countryLists = await GetCountryLists(countryID);
      setPlaylists(countryLists);
    }
  });

  return (
    <>
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
      <div className={styles.container}>
        <Header countryName={countryName} pageType={"Country"} />
        <Playlist countryID={countryID} lists={playlists}></Playlist>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  //Enable page access to both country code and names.
  let id;
  let countryName;
  if (countryMap[context.query.id]) {
    id = context.query.id;
    countryName = countryMap[id];
  } else {
    const getKeyByValue = (obj, value) =>
      Object.keys(obj).find((key) => obj[key] === value);
    id = getKeyByValue(countryMap, context.query.id);
    if (id) {
      countryName = context.query.id;
    } else {
      throw new Error("Country Not Found");
    }
  }
  return {
    props: {
      countryID: id,
      countryName: countryName,
    },
  };
}
