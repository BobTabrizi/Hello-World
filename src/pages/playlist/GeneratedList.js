import Head from "next/head";
import styles from "../../styles/PlaylistPage.module.css";
import Link from "next/link";
import { connectToDatabase } from "../../../util/mongodb";
import SongButton from "../../components/SongButton";
import React, { useState, useEffect } from "react";
import ListHelper from "../../BackendFunctions/GetLists";
import ListCreator from "../../BackendFunctions/CreateList";
import DeviceManager from "../../BackendFunctions/DeviceManager";
import SkeletonElement from "../../Skeletons/SkeletonElement";
import SkeletonSongItem from "../../Skeletons/SkeletonSongItem";
export default function GeneratedList({ countryCode }) {
  const [token, setToken] = useState("");
  const [songs, setSongs] = useState(null);
  const [uriArr, setUriArray] = useState([]);
  const [pageHeading, setPageHeading] = useState("Custom Playlist");

  const handleSongClick = async (e, trackNumber, selectedCountryID, href) => {
    //Logging SongPlay count
    fetch(
      `${process.env.NEXT_PUBLIC_PROD_URL}/api/datalog/logCustom?SongPlays=1&countryID=${selectedCountryID}`
    );
    DeviceManager(token, uriArr, trackNumber, href);
  };

  useEffect(async () => {
    //On first load, get details and create the playlist.
    let tempToken = localStorage.getItem("Token");
    if (token === "") {
      setToken(tempToken);
      let isRandomPlaylist = false;
      let songArray = await ListHelper(countryCode, isRandomPlaylist);
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
        <Link href="/">
          <a>
            <div className={styles.returnButton} style={{ fontSize: 20 }}>
              Back to Home
            </div>
          </a>
        </Link>
        {pageHeading}
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
  // console.log(context.query);
  const { db } = await connectToDatabase();
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
      countryCode: countryList,
    },
  };
}
