import "../styles/globals.css";
import { Provider } from "next-auth/client";
import Header from "../components/Header";
function MyApp({ Component, pageProps }) {
  return (
    <Provider session={pageProps.session}>
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
