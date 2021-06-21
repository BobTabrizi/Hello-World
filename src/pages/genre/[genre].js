import Head from "next/head";
import styles from "../../styles/CountryPage.module.css";
import Link from "next/link";
import { connectToDatabase } from "../../../util/mongodb";
import React, { useState, useEffect } from "react";
import GetGenreLists from "../../BackendFunctions/GetGenreLists";

export default function Country({ genre }) {
  const [token, setToken] = useState("");
  const [countries, setCountries] = useState(null);
  const [tokenState, setTokenState] = useState(false);
  useEffect(async () => {
    setTokenState(true);
    if (!tokenState) {
      let token = await fetch(
        `${process.env.NEXT_PUBLIC_PROD_URL}/api/auth/getToken?Type=Anon`
      );
      let tokenData = await token.json();
      // const countryList = await GetGenreLists(genre);
      setCountries(countryList);
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
          <link rel="preconnect" href="https://fonts.gstatic.com"></link>
          <link
            href="https://fonts.googleapis.com/css2?family=Codystar&display=swap"
            rel="stylesheet"
          ></link>
        </Head>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const { db } = await connectToDatabase();
  genreName = context.query.genre;

  return {
    props: {
      genre: genreName,
    },
  };
}
