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

export default function Home(props) {
  const [country, setCountry] = useState(["", ""]);

  useEffect(() => {
    localStorage.setItem("Token", props.token);
  });

  const getLists = async () => {
    // for (var key in Data) {
    const id = Data[3].countryID;
    const url = Data[3].playlists[0].url;

    const data = await fetch(`http://localhost:3000/api/${id}/${url}`);

    const res = await data.json();
  };
  //  };

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
        <button onClick={getLists}>Get playlist Data</button>
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
  var AccessTokenSet = false;
  var AccessToken = null;

  const setAccessToken = () => {
    let tokenPromise = null;
    if (!AccessTokenSet) {
      tokenPromise = getAccessToken()
        .then((response) => {
          AccessTokenSet = true;
          return response.access_token;
        })
        .catch((error) => {
          AccessTokenSet = false;
          console.log(error);
        });
      AccessToken = tokenPromise.then((accessToken) => {
        return accessToken;
      });
    }
    return AccessToken;
  };

  var clientString =
    process.env.SPOTIFY_CLIENT_ID + ":" + process.env.SPOTIFY_CLIENT_SECRET;

  var encodedAuth = new Buffer(clientString).toString("base64");

  const getAccessToken = () => {
    return fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      body: `grant_type=client_credentials`,
      headers: {
        Authorization: "Basic " + encodedAuth,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
      .then((resp) => resp.json())
      .then((response) => {
        console.log("New Token Recieved");
        return response;
      })
      .catch((error) => {
        console.log(error);
      });
  };

  let token = await setAccessToken();

  return {
    props: { token: token },
  };
}
