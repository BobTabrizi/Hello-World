import React, { useState, useEffect } from "react";
import Link from "next/link";
import CountryData from "../Countries.json";
export default function DiscoverButton() {
  const [randomCountry, setRandomCountry] = useState("US");

  useEffect(() => {
    let rNum = Math.floor(Math.random() * 243);
    setRandomCountry(CountryData[rNum].code);
  });

  return (
    <>
      <Link href={`/playlist/${randomCountry}`}>
        <button>Suprise Me</button>
      </Link>
    </>
  );
}
