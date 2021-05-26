import React, { useState, useEffect } from "react";
import Link from "next/link";
import CountryData from "../Countries.json";
import styles from "../styles/GeneratorButton.module.css";
export default function DiscoverButton() {
  const [randomCountry, setRandomCountry] = useState("");

  useEffect(() => {
    if (randomCountry === "") {
      let rNum = Math.floor(Math.random() * 243);
      setRandomCountry(CountryData[rNum].code);
    }
  });

  return (
    <>
      <Link href={`/playlist/${randomCountry}`}>
        <button className={styles.button}>I'm feeling adventurous</button>
      </Link>
    </>
  );
}
