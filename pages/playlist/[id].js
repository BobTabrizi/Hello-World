import Head from "next/head";
import Header from "../../components/Header";
import styles from "../../styles/Home.module.css";
import Link from "next/link";
import { connectToDatabase } from "../../util/mongodb";
import { useRouter } from "next/router";

export default function Playlist({ songs }) {
  //Base case for unsigned in user, open new window with url.
  //Return to this when user integration is implemented.
  const handleSongClick = async (e, url) => {
    //const userToken = localStorage.getItem("Token");
    window.open(url, "_blank");
    /*
    const res = await fetch("https://api.spotify.com/v1/me/player/devices", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${userToken}`,
        "Content-Type": "application/json",
      },
    });
    console.log(res);
    */
  };

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
              <div
                onClick={(e) =>
                  handleSongClick(e, song.track.external_urls.spotify)
                }
                style={{ fontSize: 30, color: "black" }}
              >
                {song.track.name}
                <img
                  src={song.track.album.images[0].url}
                  width="300"
                  height="300"
                  alt="Song Image"
                ></img>
              </div>
            </div>
          ))}
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  //console.log(context.query);
  const id = context.query;
  //  console.log(id.id);
  const { db } = await connectToDatabase();
  const data = await db
    .collection("Playlists")
    .find({ countryID: id.id })
    .limit(1)
    .toArray();

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
