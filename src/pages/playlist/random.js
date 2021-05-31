import Head from "next/head";
import styles from "../../styles/PlaylistPage.module.css";
import Link from "next/link";
import Countries from "../../../Data/Countries.json";
import { connectToDatabase } from "../../../util/mongodb";
import SongButton from "../../components/SongButton";
import ListCreator from "../../BackendFunctions/CreateList";
import React, { useState, useEffect } from "react";
import listHelper from "../../BackendFunctions/GetLists";
import DeviceManager from "../../BackendFunctions/DeviceManager";
import ListCreator from "../../BackendFunctions/CreateList";
import SkeletonSongItem from "../../Skeletons/SkeletonSongItem";
export default function randomPlaylist({ countryArray }) {
  const [token, setToken] = useState("");
  const [songs, setSongs] = useState(null);
  const [uriArray, setUriArray] = useState([]);

  const handleSongClick = async (e, trackNumber, selectedCountryID, href) => {
    fetch(
      `http://localhost:3000/api/datalog/logRandom?SongPlays=1&countryID=${selectedCountryID}`
    );

    DeviceManager(token, uriArray, trackNumber, href);
  };

  useEffect(async () => {
    let tempToken = localStorage.getItem("Token");
    //On first load, get details and create the playlist.
    if (token === "") {
      setToken(tempToken);
      ListCreator("Random Countries", songs);

      let isRandomPlaylist = true;

      let songData = await listHelper(countryArray, isRandomPlaylist);
      let trackURI = [];
      for (let i = 0; i < songData.length; i++) {
        trackURI.push(`${songData[i].track.uri}`);
      }
      setUriArray(trackURI);
      setSongs(songData);
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
      <Link href="/">
        <a>
          <div className={styles.returnButton} style={{ fontSize: 20 }}>
            Back to Home
          </div>
        </a>
      </Link>
      <div className={styles.playlistHeader} style={{ fontSize: 50 }}>
        Random Playlists
      </div>
      <div className={styles.songContainer}>
        {!songs &&
          [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
            <div className={styles.skeletonSongItems} key={n}>
              <SkeletonSongItem key={n} />
            </div>
          ))}
        {songs &&
          songs.map((song, index) => (
            <div className={styles.songItems} key={index}>
              <div
                onClick={(e) =>
                  handleSongClick(
                    e,
                    index,
                    song.countryID,
                    song.track.external_urls.spotify
                  )
                }
              >
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
  for (let i = 0; i < countryArr.length; i++) {
    db.collection("testCollection").findOneAndUpdate(
      { countryID: countryArr[i] },
      {
        $inc: {
          "Data.randomCountries.appearances": 1,
        },
      },
      { remove: false }
    );
  }

  console.log(countryArr);

  return {
    props: { countryArray: countryArr },
  };
}
