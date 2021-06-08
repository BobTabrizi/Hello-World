import Head from "next/head";
import styles from "../../styles/PlaylistPage.module.css";
import Link from "next/link";
import Countries from "../../../Data/Countries.json";
import { connectToDatabase } from "../../../util/mongodb";
import ListCreator from "../../BackendFunctions/CreateList";
import React, { useState, useEffect } from "react";
import listHelper from "../../BackendFunctions/GetLists";
import SongList from "../../components/PlaylistPage/SongList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpotify } from "@fortawesome/free-brands-svg-icons";
import { config, dom } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;
export default function randomPlaylist({
  countryArray,
  countryNameArray,
  logUrl,
}) {
  const [token, setToken] = useState("");
  const [songs, setSongs] = useState(null);
  const [uriArray, setUriArray] = useState([]);
  const [playlistUrl, setPlaylistURL] = useState("https://open.spotify.com/");
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
        isCustomPlaylist,
        "NA"
      );

      let trackURI = [];
      for (let i = 0; i < songData.length; i++) {
        trackURI.push(`${songData[i].track.uri}`);
      }
      setUriArray(trackURI);
      setSongs(songData);
      let playlistURL = await ListCreator(countryNameArray, "random", songData);
      setPlaylistURL(playlistURL);
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
          <style>{dom.css()}</style>
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
        <a href={playlistUrl} target="_blank">
          <button
            className={styles.spotifyLink}
            style={{
              fontSize: 18,
              textAlign: "center",
            }}
          >
            <FontAwesomeIcon
              icon={faSpotify}
              style={{
                marginRight: 10,
                color: "#1DB954",
                verticalAlign: "middle",
              }}
              size="2x"
            ></FontAwesomeIcon>
            View it on Spotify
          </button>
        </a>
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
  let countryCodeArr = [];
  let countryNameArr = [];
  for (let i = 0; i < 10; i++) {
    let rNum = Math.floor(Math.random() * 100);
    //Handle duplicates
    if (countryCodeArr.includes(Countries[rNum].code)) {
      i--;
      continue;
    }
    countryCodeArr.push(Countries[rNum].code);
    countryNameArr.push(Countries[rNum].name);
  }
  let logString = "/api/datalog/logRandom?SongPlays=1&countryID=";

  for (let i = 0; i < countryCodeArr.length; i++) {
    db.collection("Countries").findOneAndUpdate(
      { countryID: countryCodeArr[i] },
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
      countryArray: countryCodeArr,
      countryNameArray: countryNameArr,
      logUrl: logString,
    },
  };
}
