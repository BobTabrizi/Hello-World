import Head from "next/head";
import Header from "../../components/Header";
import styles from "../../styles/CustomPlaylist.module.css";
import Link from "next/link";
import SongButton from "../../components/SongButton";
import Countrycomplete from "../../components/Countrycomplete";
import React, { useState, useEffect } from "react";
export default function GeneratedList() {
  const [token, setToken] = useState("");

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
    </>
  );
}
