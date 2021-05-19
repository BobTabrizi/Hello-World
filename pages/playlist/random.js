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

  //Base case for unsigned in user, open new window with url.
  //Return to this when user integration is implemented.
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
    // console.log(window.location.hash.length);
    //song.track.external_urls.spotify
    // console.log(hashParams.access_token);
    // let tempToken = localStorage.getItem("Token");
    // setToken(tempToken);
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

  //const songs = resData[0].Playlists[0].tracks;
  //const countryName = resData[0].countryName;

  return {
    props: { songs: randomSongs },
  };
}
