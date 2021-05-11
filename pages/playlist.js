import Head from "next/head";
import Header from "../components/Header";
import styles from "../styles/Home.module.css";
import Link from "next/link";
import { connectToDatabase } from "../util/mongodb";

export default function Playlist({ songs }) {
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
            type="text/css"
            href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
          />
          <link
            rel="stylesheet"
            type="text/css"
            href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
          />
        </Head>
      </div>
      <Link href="/">
        <a>Back to Home</a>
      </Link>
      <div className="flex flex-row flex-wrap">
        {songs &&
          songs.map((song) => (
            <div className="flex-auto w-1/6 rounded overflow-hidden shadow-lg m-3">
              <p style={{ fontSize: 30, color: "black" }}>
                <a
                  href={song.track.external_urls.spotify}
                  style={{ fontSize: 10 }}
                >
                  {song.track.name}
                </a>
              </p>
              <img
                src={song.track.album.images[0].url}
                width="300"
                height="300"
                alt="Song Image"
              ></img>
            </div>
          ))}
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const { db } = await connectToDatabase();

  const data = await db.collection("Playlists").find().limit(1).toArray();

  const songs = JSON.parse(JSON.stringify(data));

  const cleanData = songs.map((song) => {
    return {
      countryID: song.countryID,
      items: song.items,
    };
  });

  return {
    props: { songs: cleanData[0].items },
  };
}
