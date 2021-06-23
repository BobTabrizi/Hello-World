import React, { useState, useEffect } from "react";
import Link from "next/link";
import countryMap from "../../../Data/countryMap.json";
import styles from "../../styles/CountryFeature.module.css";
export default function FeaturedCountry(props) {
  let countryName = countryMap[props.featuredCountryID];
  return (
    <>
      <div className={styles.featureHeader} style={{ fontSize: 19 }}>
        Country of the Day
      </div>
      <div className={styles.featuredName} style={{ fontSize: 15 }}>
        {countryName}
      </div>
      <Link href={`/country/${props.featuredCountryID}`}>
        <div
          className={styles.featureButton}
          style={{
            backgroundImage: `url('/flags/${props.featuredCountryID}.png')`,
            backgroundSize: "cover",
          }}
        ></div>
      </Link>
    </>
  );
}
