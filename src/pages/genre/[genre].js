import Head from "next/head";
import styles from "../../styles/GenrePage.module.css";
import countryMap from "../../../Data/countryMap";
import Genres from "../../../Data/Genres.json";
import React, { useState, useEffect } from "react";
import GetCountryByGenre from "../../BackendFunctions/GetGenreLists";
import ReRollButton from "../../components/ReRollButton";
import GenreList from "../../components/PlaylistPages/GenreList";
import Header from "../../components/PlaylistPages/Header";
export default function Country(props) {
  const [countryList, setCountryList] = useState(null);
  useEffect(async () => {
    let countryArray;
    if (!countryList) {
      countryArray = await GetCountryByGenre(props.genre);
      for (let i = 0; i < countryArray.length; i++) {
        countryArray[i].countryName = countryMap[countryArray[i].countryID];
      }

      //Sort countries alphabetically to make it easier to find countries of interest
      countryArray.sort((a, b) => (a.countryName > b.countryName && 1) || -1);
      setCountryList(countryArray);
    }
  });

  let ReRollComponent;
  if (props.RandomQuery === true) {
    ReRollComponent = (
      <div style={{ textAlign: "center" }}>
        <ReRollButton discoverMode={"Genre"} current={props.genre} />
      </div>
    );
  } else {
    ReRollComponent = null;
  }
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
        <Header genre={props.genre} pageType={"Genre"} />
        {ReRollComponent}
        <GenreList
          countryList={countryList}
          genre={props.genre}
          randomSearchMode={props.RandomQuery}
        />
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  //Enable page access to both country code and names.

  let isRandom = false;
  if (context.query.random) {
    isRandom = true;
  }
  return {
    props: {
      RandomQuery: isRandom,
      genre: context.query.genre,
    },
  };
}
