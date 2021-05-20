import Head from "next/head";
import { useRouter } from "next/router";
import Header from "../components/Header";
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
import AuthHelper from "../BackendFunctions/AuthHelper";
import DiscoverButton from "../components/DiscoverButton";
import PlaylistGenerator from "../components/PlayListGenerator";
import { config, dom } from "@fortawesome/fontawesome-svg-core";

//Line below to fix css issues with spotify button.
config.autoAddCss = false;
export default function Home(props) {
  const [token, setToken] = useState("");

  useEffect(() => {
    // console.log(window.location.hash.length);
    if (window.location.hash.length > 10) {
      let hashParams = {};
      let a,
        b = /([^&;=]+)=?([^&;]*)/g,
        c = window.location.hash.substring(1);
      while ((a = b.exec(c))) {
        hashParams[a[1]] = decodeURIComponent(a[2]);
      }
      // console.log(hashParams.access_token);
      localStorage.setItem("Token", hashParams.access_token);
      localStorage.setItem("TokenTime", Date.now);
      setToken(hashParams.access_token);

      //Avoids mandatory refresh. But double check if this is solid
      window.history.replaceState(null, "", "/");

      //This causes a mandatory refresh due to SSR.
      //TODO See if there is a more efficient way.
      // window.location.replace("/");
    } else {
      if (localStorage.getItem("token")) {
        let tempToken = localStorage.getItem("Token");
        setToken(tempToken);
      }
    }
    console.log(token);
  });

  return (
    <>
      <Header />
      <div className={styles.container}>
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <link
            href="https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css"
            rel="stylesheet"
          ></link>
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
          ></link>
          <style>{dom.css()}</style>
        </Head>
        <AuthHelper token={token} />
        <div className="searchBody">
          <Countrycomplete />
          <DiscoverButton />
          <PlaylistGenerator />
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  // let token = await tokenHelper();

  let images = [];
  let temp;
  // console.log(context);
  //for (var key in Data) {
  /*
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
*/
  let tempr = "placeholder";
  return {
    props: { temp: tempr },
  };
}
