import Head from "next/head";
import Header from "../../components/Header";
import styles from "../../styles/PlaylistPage.module.css";
import Link from "next/link";
import { connectToDatabase } from "../../util/mongodb";
import SongButton from "../../components/SongButton";
import Countrycomplete from "../../components/Countrycomplete";
import React, { useState, useEffect } from "react";
export default function GeneratedList({ songs, countries }) {
  const [token, setToken] = useState("");

  //console.log(songs.length);
  //console.log(countries);
  const handleSongClick = async (e, uri) => {
    //window.open(url, "_blank");

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
      let uriArray = [];

      for (let i = 0; i < songs.length; i++) {
        uriArray.push(songs[i].track.uri);
      }
      let tempToken = localStorage.getItem("Token");
      console.log(tempToken);
      setToken(tempToken);
      fetch("https://api.spotify.com/v1/me/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${tempToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
        .then((resp) => resp.json())
        .then((response) => {
          let data = {
            name: "`````````````````````````",
            description: `Music from ${countries}`,
            public: true,
          };

          fetch(`https://api.spotify.com/v1/users/${response.id}/playlists`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${tempToken}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify(data),
          })
            .then((resp) => resp.json())
            .then((response) => {
              fetch(
                `https://api.spotify.com/v1/playlists/${response.id}/tracks`,
                {
                  method: "POST",
                  headers: {
                    Authorization: `Bearer ${tempToken}`,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                  },
                  body: JSON.stringify(uriArray),
                }
              );
            });
        });
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
        {songs &&
          songs.map((song) => (
            <div className={styles.songItems}>
              <div onClick={(e) => handleSongClick(e, song.track.uri)}>
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
  //  console.log(id.id);
  //console.log(countryList);

  let finalData = [];
  let countryNames = [];
  // let tempCountry = countryList[i];
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
    }
  }

  // const songs = resData[0].Playlists[0].tracks;
  // const countryName = resData[0].countryName;
  return {
    // props: { songs: songs, countryName: countryName },
    props: { songs: finalData, countries: countryNames },
  };
}
