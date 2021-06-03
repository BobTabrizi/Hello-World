import Head from "next/head";
import styles from "../../styles/PlaylistPage.module.css";
import Link from "next/link";
import Countries from "../../../Data/Countries.json";
import { connectToDatabase } from "../../../util/mongodb";
import SongButton from "../../components/SongButton";
import ListCreator from "../../BackendFunctions/CreateList";
import React, { useState, useEffect } from "react";
import SpotifyData from "../../../Data/Data.json";
import NonSpotify from "../../../Data/ExternalData.json";
import listHelper from "../../BackendFunctions/GetLists";
import SongList from "../../components/SongList";
export default function randomPlaylist({ countryArray, logUrl }) {
  const [token, setToken] = useState("");
  const [songs, setSongs] = useState(null);
  const [uriArray, setUriArray] = useState([]);

  useEffect(async () => {
    let tempToken = localStorage.getItem("Token");
    //On first load, get details and create the playlist.
    if (token === "") {
      setToken(tempToken);
      let isRandomPlaylist = true;
      let isCustomPlaylist = false;
      let songData = await listHelper(
        countryArray,
        isRandomPlaylist,
        isCustomPlaylist
      );

      let trackURI = [];
      for (let i = 0; i < songData.length; i++) {
        console.log(songData[i].track.album.images[0].url);
        trackURI.push(`${songData[i].track.uri}`);
      }
      setUriArray(trackURI);
      setSongs(songData);
      ListCreator("Random Countries", songData);
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
        <div style={{ marginTop: "1.5rem" }}> Random Playlist</div>
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
  const { db } = await connectToDatabase();
  let countryArr = [];
  for (let i = 0; i < 10; i++) {
    let rNum = Math.floor(Math.random() * 100);
    //Handle duplicates
    if (countryArr.includes(Countries[rNum].code)) {
      i--;
      continue;
    }
    countryArr.push(Countries[rNum].code);
  }

  console.log(countryArr);
  let logString = "/api/datalog/logRandom?SongPlays=1&countryID=";

  for (let i = 0; i < countryArr.length; i++) {
    db.collection("Countries").findOneAndUpdate(
      { countryID: countryArr[i] },
      {
        $inc: {
          "Data.randomCountries.appearances": 1,
        },
      },
      { remove: false }
    );
  }
  return {
    props: { countryArray: countryArr, logUrl: logString },
  };
}
