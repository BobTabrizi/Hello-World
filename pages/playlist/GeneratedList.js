import Head from "next/head";
import Header from "../../components/Header";
import styles from "../../styles/PlaylistPage.module.css";
import Link from "next/link";
import { connectToDatabase } from "../../util/mongodb";
import SongButton from "../../components/SongButton";
import Countrycomplete from "../../components/Countrycomplete";
import React, { useState, useEffect } from "react";
import { TemporaryCredentials } from "aws-sdk";
import ListCreator from "../../BackendFunctions/CreateList";
export default function GeneratedList({
  songs,
  countries,
  sectionedSongs,
  countryCode,
}) {
  const [token, setToken] = useState("");

  const handleSongClick = async (e, uri, selectedCountry) => {
    //Logging SongPlay count
    fetch(
      `http://localhost:3000/api/datalog/logCustom?SongPlays=1&countryID=${selectedCountry}`
    );

    fetch("https://api.spotify.com/v1/me/player/devices", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((resp) => resp.json())
      .then((response) => {
        let index = 0;
        while (response.devices[index]) {
          if (!response.devices[index].is_restricted) {
            return response.devices[index].id;
          }
        }
      })
      .then((device) => {
        fetch("https://api.spotify.com/v1/me/player/play", {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          params: {
            device_id: device,
          },
          data: {
            context_uri: uri,
          },
        });
      });
  };

  useEffect(() => {
    //On first load, get details and create the playlist.
    if (token === "") {
      ListCreator(countries, songs);
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
      <div className={styles.pageHeader}>Here are your Playlists</div>
      <div className={styles.songContainer}>
        {sectionedSongs[0] &&
          sectionedSongs[0].map((song) => (
            <div className={styles.songItems}>
              <div
                onClick={(e) =>
                  handleSongClick(e, song.track.uri, countryCode[0])
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
        {sectionedSongs[1] &&
          sectionedSongs[1].map((song) => (
            <div className={styles.songItems}>
              <div
                onClick={(e) =>
                  handleSongClick(e, song.track.uri, countryCode[1])
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
        {sectionedSongs[2] &&
          sectionedSongs[2].map((song) => (
            <div className={styles.songItems}>
              <div
                onClick={(e) =>
                  handleSongClick(e, song.track.uri, countryCode[2])
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
  //console.log(countryList);

  for (let i = 0; i < countryList.length; i++) {
    db.collection("testCollection").findOneAndUpdate(
      { countryID: countryList[i] },
      {
        $inc: {
          "Data.customCountries.searches": 1,
        },
      },
      { remove: false }
    );
  }
  let finalData = [],
    sectionData = [],
    tempData = [],
    countryNames = [];

  const data = await db
    .collection("Countries")
    .find({ countryID: { $in: countryList } })
    .limit(3)
    .toArray();
  const resData = JSON.parse(JSON.stringify(data));
  //console.log(resData);
  for (let i = 0; i < countryList.length; i++) {
    let playListLength = resData[i].Playlists[0].tracks.length;
    countryNames.push(resData[i].countryName);
    //let rNum = Math.floor(Math.random() * (playListLength - 1));
    for (let j = 0; j < 30; j++) {
      finalData.push(resData[i].Playlists[0].tracks[j]);
      tempData.push(resData[i].Playlists[0].tracks[j]);
    }
    sectionData[i] = tempData;
    tempData = [];
  }

  return {
    props: {
      songs: finalData,
      countries: countryNames,
      countryCode: countryList,
      sectionedSongs: sectionData,
    },
  };
}
