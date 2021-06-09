import "../styles/globals.css";
import Header from "../components/HomePage/PageHeader";
import React from "react";
function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
