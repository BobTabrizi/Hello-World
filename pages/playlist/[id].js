import Head from "next/head";
import Header from "../../components/Header";
import styles from "../../styles/PlaylistPage.module.css";
import Link from "next/link";
import { connectToDatabase } from "../../util/mongodb";
import { useRouter } from "next/router";
import SongButton from "../../components/SongButton";
import React, { useState, useEffect } from "react";

export default function Playlist({ songs, countryName, countryID }) {
  const [token, setToken] = useState("");

  //Base case for unsigned in user, open new window with url.
  //Return to this when user integration is implemented.
  const handleSongClick = async (e, uri) => {
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
    // console.log(window.location.hash.length);
    //song.track.external_urls.spotify
    // console.log(hashParams.access_token);
    let tempToken = localStorage.getItem("Token");
    setToken(tempToken);
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
            rel="stylesheet"
            type="text/css"
            href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
          />
          <link
            rel="stylesheet"
            type="text/css"
            href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
          />
        </Head>
      </div>
      <Link href="/">
        <a>Back to Home</a>
      </Link>

      <div className={styles.playlistHeader} style={{ fontSize: 50 }}>
        {countryName}
      </div>

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
  //console.log(context.query);
  const { db } = await connectToDatabase();
  const id = context.query;
  if (!context.query.random) {
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

  const data = await db
    .collection("Countries")
    .find({ countryID: id.id })
    .limit(1)
    .toArray();
  const resData = JSON.parse(JSON.stringify(data));
  const songs = resData[0].Playlists[0].tracks;
  const countryName = resData[0].countryName;

  return {
    props: {
      songs: songs,
      countryName: countryName,
      countryID: id.id,
    },
  };
}
