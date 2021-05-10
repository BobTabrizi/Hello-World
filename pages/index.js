import Head from "next/head";
import Header from "../components/Header";
import styles from "../styles/Home.module.css";

export default function Home() {
  const getLists = async () => {
    const data = await fetch(`http://localhost:3000/api/playlist`);

    console.log(data);
    const res = await data.json();
    console.log(res);
  };

  return (
    <div className={styles.container}>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      Hello. Get some Songs?
      <button onClick={() => getLists()}>Click me!</button>
    </div>
  );
}
