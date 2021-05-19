import React, { useState, useEffect } from "react";
import Link from "next/link";
import CountryData from "../Countries.json";
export default function playlistGenerator() {
  const [randomCountry, setRandomCountry] = useState("");

  useEffect(() => {
    if (randomCountry === "") {
      let rNum = Math.floor(Math.random() * 243);
      setRandomCountry(CountryData[rNum].code);
    }
  });

  return (
    <>
      <Link href={`/playlist/random`}>
        <button>Make a Random Playlist</button>
      </Link>
    </>
  );
}
