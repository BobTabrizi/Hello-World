import Head from "next/head";
import styles from "../../styles/PlaylistPage.module.css";
import Link from "next/link";
import { connectToDatabase } from "../../../util/mongodb";
import React, { useState, useEffect } from "react";
import ListHelper from "../../BackendFunctions/GetLists";
import Header from "../../components/PlaylistPages/Header";
import ListCreator from "../../BackendFunctions/CreateList";
import SongList from "../../components/PlaylistPages/SongList";
import { config, dom } from "@fortawesome/fontawesome-svg-core";
import SpotifyButton from "../../components/PlaylistPages/SpotifyViewButton";
config.autoAddCss = false;
export default function GeneratedList({ countryCodes, logUrl }) {
  const [token, setToken] = useState("");
  const [songs, setSongs] = useState(null);
  const [uriArray, setUriArray] = useState([]);
  const [playlistUrl, setPlaylistURL] = useState("https://open.spotify.com/");
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
        isCustomPlaylist,
        "NA"
      );
      let countries = songArray[songArray.length - 1];
      songArray.length = songArray.length - 1;
      let mergedSongArray = songArray.flat(1);
      setSongs(mergedSongArray);
      let playlistURL = await ListCreator(countries, "custom", mergedSongArray);
      setPlaylistURL(playlistURL);
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
          <style>{dom.css()}</style>
        </Head>
      </div>
      <Header playlistUrl={playlistUrl} pageType={"Custom"} />

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
