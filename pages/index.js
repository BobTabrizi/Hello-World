import Head from "next/head";
import Header from "../components/Header";
import Authentication from "../components/Authentication";
import styles from "../styles/Home.module.css";
import { S3 } from "@aws-sdk/client-s3";
//import { connectToDatabase } from "../util/mongodb";
import FlagCarousel from "../components/Carousel";
import Link from "next/link";
import Data from "../Data.json";
import React, { useEffect, useState } from "react";
import Countrycomplete from "../components/Countrycomplete";
import tokenHelper from "../BackendFunctions/getToken";
import listRetriever from "../BackendFunctions/getLists";
export default function Home(props) {
  const [country, setCountry] = useState(["", ""]);

  console.log(props);
  useEffect(() => {
    localStorage.setItem("Token", props.token);
  });

  return (
    <>
      <Header />
      <FlagCarousel />
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
        <Authentication />
        <button onClick={listRetriever}>Get playlist Data</button>
        <Countrycomplete updateCountry={setCountry} />
        <Link href={`/playlist/${country[1]}`}>
          <a>Go to Playlist</a>
        </Link>
        {props.test}
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  let token = await tokenHelper();

  let images = [];
  let temp;

  //for (var key in Data) {
  const id = Data[3].countryID;

  fetch(`http://localhost:3000/api/${id}/flag`, {
    method: "GET",
  })
    .then((body) => {
      return body.text();
    })
    .then((data) => {
      console.log(data);
    });

  // }

  return {
    props: { token: token },
  };
}
