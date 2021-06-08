import Head from "next/head";
import styles from "../../styles/PlaylistPage.module.css";
import Link from "next/link";
import { connectToDatabase } from "../../../util/mongodb";
import React, { useState, useEffect } from "react";
import countryMap from "../../../Data/countryMap.json";
import listHelper from "../../BackendFunctions/GetLists";
import SongList from "../../components/PlaylistPage/SongList";
export default function Playlist({ countryID, countryName, logUrl, genre }) {
  const [token, setToken] = useState("");
  const [songs, setSongs] = useState(null);
  const [uriArray, setUriArray] = useState([]);
  useEffect(async () => {
    let tempToken = localStorage.getItem("Token");
    //Boolean for helper function.
    let isRandomPlaylist = false;
    let isCustomPlaylist = false;
    if (token === "") {
      setToken(tempToken);
      const result = await listHelper(
        [countryID],
        isRandomPlaylist,
        isCustomPlaylist,
        genre
      );
      let trackURI = [];
      let selectedList;
      for (let i = 0; i < result[0].Playlists.length; i++) {
        if (genre === result[0].Playlists[i].genre) {
          selectedList = i;
        }
      }

      let countryTracks = result[0].Playlists[selectedList].tracks;
      console.log(countryTracks);
      for (let i = 0; i < countryTracks.length; i++) {
        trackURI.push(`${countryTracks[i].track.uri}`);
      }
      //const songs = result[0].Playlists[0].tracks;
      setSongs(countryTracks);
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
          <link rel="preconnect" href="https://fonts.gstatic.com"></link>
          <link
            href="https://fonts.googleapis.com/css2?family=Codystar&display=swap"
            rel="stylesheet"
          ></link>
        </Head>
      </div>

      <div className={styles.playlistHeader} style={{ fontSize: 70 }}>
        <div>
          <Link href="/">
            <a>
              <button className={styles.returnButton} style={{ fontSize: 20 }}>
                Return to main page
              </button>
            </a>
          </Link>
        </div>
        <div>
          <Link href={`/country/${countryID}`}>
            <a>
              <button className={styles.returnButton} style={{ fontSize: 18 }}>
                Return to {countryName}
              </button>
            </a>
          </Link>
        </div>
        <div style={{ marginTop: "1.5rem" }}>{countryName}</div>
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
  //console.log(context.query);
  const { db } = await connectToDatabase();

  //Enable page access to both country code and names.
  let id;
  let countryName;
  let genre = context.query.genre;
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

  let dataString;
  if (!context.query.random) {
    dataString = `/api/datalog/logSearch?SongPlays=1&countryID=`;
    //Logging Searched Countries
    db.collection("Countries").findOneAndUpdate(
      { countryID: id },
      {
        $inc: {
          "Data.searchCountries.searches": 1,
        },
      },
      { remove: false }
    );
  } else {
    dataString = `/api/datalog/logRandom?SongPlays=1&countryID=`;
    //Logging Randomly Discovered Countries
    db.collection("Countries").findOneAndUpdate(
      { countryID: id },
      {
        $inc: {
          "Data.randomCountries.appearances": 1,
        },
      },
      { remove: false }
    );
  }
  return {
    props: {
      countryID: id,
      countryName: countryName,
      logUrl: dataString,
      genre: genre,
    },
  };
}
