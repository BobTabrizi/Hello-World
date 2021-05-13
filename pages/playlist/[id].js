import Head from "next/head";
import Header from "../../components/Header";
import styles from "../../styles/Home.module.css";
import Link from "next/link";
import { connectToDatabase } from "../../util/mongodb";
import { useRouter } from "next/router";

export default function Playlist({ songs }) {
  const router = useRouter();
  // console.log(router.query);

  /*
  const handleSongClick = async () => {
    console.log(localStorage.getItem("SPOTIFY_TOKEN"));
    const res = await fetch("https://api.spotify.com/v1/me/player/devices", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("SPOTIFY_TOKEN"),
        "Content-Type": "application/json",
      },
    });
    console.log(res);
  };
*/
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
              <div style={{ fontSize: 30, color: "black" }}>
                <a
                  href={song.track.external_urls.spotify}
                  style={{ fontSize: 10 }}
                >
                  {song.track.name}
                </a>

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
