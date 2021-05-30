import Head from "next/head";
import styles from "../../styles/PlaylistPage.module.css";
import Link from "next/link";
import { connectToDatabase } from "../../../util/mongodb";
import SongButton from "../../components/SongButton";
import React, { useState, useEffect } from "react";
import countryMap from "../../../Data/countryMap.json";
import listHelper from "../../BackendFunctions/GetLists";
import DeviceManager from "../../BackendFunctions/DeviceManager";
import SkeletonElement from "../../Skeletons/SkeletonElement";
import SkeletonSongItem from "../../Skeletons/SkeletonSongItem";
export default function Playlist({ countryID, searchTypeRandom, countryName }) {
  const [token, setToken] = useState("");
  const [songs, setSongs] = useState(null);
  const [uriArr, setUriArray] = useState([]);

  const handleSongClick = async (e, trackNumber) => {
    //window.open(url, "_blank");
    //Logging SongPlay count
    if (searchTypeRandom === true)
      fetch(
        `http://localhost:3000/api/datalog/logRandom?SongPlays=1&countryID=${countryID}`
      );
    else {
      fetch(
        `http://localhost:3000/api/datalog/logSearch?SongPlays=1&countryID=${countryID}`
      );
    }
    DeviceManager(token, uriArr, trackNumber);
  };

  useEffect(async () => {
    let tempToken = localStorage.getItem("Token");

    //Boolean for helper function.
    let isRandomPlaylist = false;
    if (token === "") {
      setToken(tempToken);
      const result = await listHelper([countryID], isRandomPlaylist);
      let trackURI = [];
      for (let i = 0; i < result[0].Playlists[0].tracks.length; i++) {
        trackURI.push(`${result[0].Playlists[0].tracks[i].track.uri}`);
      }
      const songs = result[0].Playlists[0].tracks;
      setSongs(songs);
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
        </Head>
      </div>
      <Link href="/">
        <a>Back to Home</a>
      </Link>
      <div className={styles.playlistHeader} style={{ fontSize: 50 }}>
        {countryName}
      </div>

      <div className={styles.songContainer}>
        {!songs &&
          [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
            <div className={styles.songItems} key={n}>
              <SkeletonSongItem key={n} />
            </div>
          ))}
        {songs &&
          songs.map((song, index) => (
            <div className={styles.songItems} key={index}>
              <div onClick={(e) => handleSongClick(e, index)}>
                <SongButton song={song} />
                <div className={styles.songDetails}>
                  <div className={styles.trackName}>{song.track.name}</div>
                  <div className={styles.artistName}>
                    {song.track.artists[0].name}
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  //console.log(context.query);
  const { db } = await connectToDatabase();
  const id = context.query;
  const countryName = countryMap[id.id];
  let searchTypeRandom;

  if (!context.query.random) {
    searchTypeRandom = false;
    //Logging Searched Countries
    db.collection("testCollection").findOneAndUpdate(
      { countryID: id.id },
      {
        $inc: {
          "Data.searchCountries.searches": 1,
        },
      },
      { remove: false }
    );
  } else {
    searchTypeRandom = true;
    //Logging Randomly Discovered Countries
    db.collection("testCollection").findOneAndUpdate(
      { countryID: id.id },
      {
        $inc: {
          "Data.randomCountries.searches": 1,
        },
      },
      { remove: false }
    );
  }
  return {
    props: {
      countryID: id.id,
      searchTypeRandom: searchTypeRandom,
      countryName: countryName,
    },
  };
}