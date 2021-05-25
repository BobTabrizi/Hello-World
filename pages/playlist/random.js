import Head from "next/head";
import Header from "../../components/Header";
import styles from "../../styles/PlaylistPage.module.css";
import Link from "next/link";
import { connectToDatabase } from "../../util/mongodb";
import { useRouter } from "next/router";
import SongButton from "../../components/SongButton";
import React, { useState, useEffect } from "react";

export default function randomPlaylist({ songs }) {
  const [token, setToken] = useState("");

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
            name: "Test API V5",
            description: "This is a test",
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
  const id = context.query;
  //  console.log(id.id);
  const { db } = await connectToDatabase();
  const data = await db
    .collection("Countries")
    .aggregate([{ $sample: { size: 50 } }])
    .toArray();

  let randomSongs = [];
  const resData = JSON.parse(JSON.stringify(data));

  for (let i = 0; i < 50; i++) {
    let playListLength = resData[i].Playlists[0].tracks.length;
    let rNum = Math.floor(Math.random() * (playListLength - 1));
    let songName = resData[i].Playlists[0].tracks[rNum].track.name;

    //Handling Potential duplicate tracks.
    if (
      randomSongs.filter((item) => item.track.name === songName).length !== 0
    ) {
      let shiftFactor = 0;
      if (rNum < playListLength) shiftFactor = 1;
      else if (rNum >= playListLength) shiftFactor = -1;
      randomSongs.push(resData[i].Playlists[0].tracks[rNum + shiftFactor]);
      continue;
    }
    randomSongs.push(resData[i].Playlists[0].tracks[rNum]);
  }
  return {
    props: { songs: randomSongs },
  };
}
