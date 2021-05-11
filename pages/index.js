import Head from "next/head";
import Header from "../components/Header";
import Authentication from "../components/Authentication";
import styles from "../styles/Home.module.css";
//import { connectToDatabase } from "../util/mongodb";
import FlagCarousel from "../components/Carousel";
import Link from "next/link";
import Data from "../Data.json";

export default function Home() {
  const getLists = async () => {
    for (var key in Data) {
      const id = Data[key].countryID;
      const url = Data[key].playlists[0].url;

      const data = await fetch(`http://localhost:3000/api/${id}/${url}`);

      const res = await data.json();
    }

    //  const res = await data.json();
    // console.log(res);
  };
  //console.log(songs);
  //console.log(songs[17].track.album.images[0]);
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
        <button onClick={() => getLists()}>Get playlist Data</button>

        <form>
          <input
            type="text"
            id="fname"
            name="fname"
            placeholder="Enter Country"
          ></input>
          <input type="submit" value="Submit"></input>
        </form>
        <Link href="/playlist/NO">
          <a>Go to Playlist</a>
        </Link>
      </div>
    </>
  );
}
