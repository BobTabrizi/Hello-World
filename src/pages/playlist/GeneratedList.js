import Head from "next/head";
import styles from "../../styles/PlaylistPage.module.css";
import Link from "next/link";
import { connectToDatabase } from "../../../util/mongodb";
import SongButton from "../../components/SongButton";
import React, { useState, useEffect } from "react";
import ListHelper from "../../BackendFunctions/GetLists";
import ListCreator from "../../BackendFunctions/CreateList";
import SongList from "../../components/SongList";

export default function GeneratedList({ countryCodes, logUrl }) {
  const [token, setToken] = useState("");
  const [songs, setSongs] = useState(null);
  const [uriArray, setUriArray] = useState([]);
  const [pageHeading, setPageHeading] = useState("Custom Playlist");

  useEffect(async () => {
    //On first load, get details and create the playlist.
    let tempToken = localStorage.getItem("Token");

    if (token === "") {
      setToken(tempToken);
      let isRandomPlaylist = false;
      let isCustomPlaylist = true;
      let songArray = await ListHelper(
        countryCodes,
        isRandomPlaylist,
        isCustomPlaylist
      );
      let countries = songArray[songArray.length - 1];
      songArray.length = songArray.length - 1;
      let mergedSongArray = songArray.flat(1);
      setSongs(mergedSongArray);
      ListCreator(countries, mergedSongArray);
      let trackURI = [];
      for (let i = 0; i < mergedSongArray.length; i++) {
        trackURI.push(`${mergedSongArray[i].track.uri}`);
      }
      setUriArray(trackURI);
    }
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
      <div className={styles.playlistHeader} style={{ fontSize: 50 }}>
        <div>
          <Link href="/">
            <a>
              <button className={styles.returnButton} style={{ fontSize: 20 }}>
                Return to main page
              </button>
            </a>
          </Link>
        </div>
        <div style={{ marginTop: "1.5rem" }}> {pageHeading}</div>
      </div>
      <SongList
        songs={songs}
        uriArray={uriArray}
        token={token}
        logUrl={logUrl}
      />
    </>
  );
}
export async function getServerSideProps(context) {
  // console.log(context.query);
  const { db } = await connectToDatabase();

  let logString = "/api/datalog/logCustom?SongPlays=1&countryID=";
  let countryList = context.query.countries.split(" ");
  for (let i = 0; i < countryList.length; i++) {
    db.collection("Countries").findOneAndUpdate(
      { countryID: countryList[i] },
      {
        $inc: {
          "Data.customCountries.searches": 1,
        },
      },
      { remove: false }
    );
  }
  return {
    props: {
      countryCodes: countryList,
      logUrl: logString,
    },
  };
}
