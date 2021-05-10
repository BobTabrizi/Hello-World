import Head from "next/head";
import Header from "../components/Header";
import styles from "../styles/Home.module.css";
import { useSession } from "next-auth/client";

export default function Home() {
  const [session, loading] = useSession();

  return (
    <div className={styles.container}>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main className={styles.main}>
        <h1 className={styles.title}>Spotify Next.js Auth</h1>
        <div className={styles.user}>
          {loading && <div className={styles.title}>Loading...</div>}
          {session && (
            <>
              {" "}
              <p style={{ marginBottom: "10px" }}>
                {" "}
                Welcome, {session.user.name ?? session.user.email}
              </p>{" "}
              <br />
            </>
          )}
          {!session && (
            <>
              <p className={styles.title}>Please Sign in</p>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
