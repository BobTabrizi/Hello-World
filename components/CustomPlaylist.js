import React, { useState, useEffect } from "react";
import Link from "next/link";
import CountryData from "../Countries.json";
import { render } from "react-dom";
import styles from "../styles/GeneratorButton.module.css";
export default function CustomPlaylist() {
  const [token, setToken] = useState("");

  useEffect(() => {
    let tempToken = localStorage.getItem("Token");
    setToken(tempToken);
  });

  if (token === null || token.length === 0) {
    return null;
  } else if (token.length > 1) {
    return (
      <>
        <Link href={`/playlist/CustomPlaylist`}>
          <button className={styles.button}>Make a Customized Playlist</button>
        </Link>
      </>
    );
  }
}
