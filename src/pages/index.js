import Head from "next/head";
import Header from "../components/HomePage/PageHeader";
import styles from "../styles/Home.module.css";
//import { S3 } from "@aws-sdk/client-s3";
//import { connectToDatabase } from "../../util/mongodb";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Countrycomplete from "../components/Countrycomplete";
import AuthHelper from "../BackendFunctions/AuthHelper";
import DiscoverButton from "../components/HomePage/DiscoverButton";
import RandomPlaylist from "../components/HomePage/RandomPlaylist";
import CustomPlaylist from "../components/HomePage/CustomPlaylist";
import SearchTypeButton from "../components/HomePage/SearchTypeButton";
import { config, dom } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;
export default function Home() {
  const [token, setToken] = useState("");
  const [country, setCountry] = useState(["", ""]);
  const [genre, setGenre] = useState("");
  const [ButtonState, setButtonState] = useState("Visible");
  const [tokenState, setTokenState] = useState(false);
  const [searchMode, setSearchMode] = useState("Country");

  const fetchToken = async (hashParams) => {
    let token = await fetch(
      `${process.env.NEXT_PUBLIC_PROD_URL}/api/auth/getToken?codeValue=${hashParams}&Type=UserToken`
    );
    let tokenData = await token.json();
    localStorage.setItem("Token", tokenData.access_token);
    localStorage.setItem("RefreshToken", tokenData.refresh_token);
    let currTime = Date.now();
    localStorage.setItem("TokenTime", currTime);
    setToken(tokenData.access_token);
    return tokenData.access_token;
  };

  const fetchRefreshedToken = async (refToken) => {
    let refreshToken = await fetch(
      `${process.env.NEXT_PUBLIC_PROD_URL}/api/auth/refreshToken?tokenValue=${refToken}&?Type=RefreshToken`
    );
    let tokenInfo = await refreshToken.json();
    localStorage.setItem("Token", tokenInfo.access_token);
    let currTime = Date.now();
    localStorage.setItem("TokenTime", currTime);
    setToken(tokenInfo.access_token);
  };

  useEffect(() => {
    if (window.location.search.length > 10) {
      let hashParams = {};
      let a,
        b = /([^&;=]+)=?([^&;]*)/g,
        c = window.location.search.substring(1);
      while ((a = b.exec(c))) {
        hashParams[a[1]] = decodeURIComponent(a[2]);
      }
      if (!tokenState) {
        fetchToken(hashParams.code);
        setTokenState(true);
      }
      window.history.replaceState(null, "", "/");
    } else if (localStorage.getItem("TokenTime")) {
      let tempTime = localStorage.getItem("TokenTime");
      const Hour = 1000 * 60 * 60;
      let HourAgo = Date.now() - Hour;
      if (tempTime < HourAgo) {
        console.log("Token Refreshed");
        let refToken = localStorage.getItem("RefreshToken");
        localStorage.removeItem("Token");
        localStorage.removeItem("TokenTime");
        fetchRefreshedToken(refToken);
      }
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
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
          ></link>
          <link rel="preconnect" href="https://fonts.gstatic.com"></link>
          <link
            href="https://fonts.googleapis.com/css2?family=Codystar&display=swap"
            rel="stylesheet"
          ></link>
          <style>{dom.css()}</style>
        </Head>
        <Header />
        <AuthHelper token={token} />
        <div className="searchBody">
          <SearchTypeButton />
          <Countrycomplete
            searchButton={false}
            updateGenre={searchMode === "Country" ? setCountry : setGenre}
            searchType={searchMode}
            linkRef={"/country/"}
            updateButtonState={setButtonState}
          />
        </div>

        <div className="functionButtons" style={{ visibility: ButtonState }}>
          <DiscoverButton />
          <RandomPlaylist />
          <CustomPlaylist />
        </div>
      </div>
    </>
  );
}
