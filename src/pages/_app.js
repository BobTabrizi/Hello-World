import "../styles/globals.css";
import Header from "../components/PageHeader";
function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
