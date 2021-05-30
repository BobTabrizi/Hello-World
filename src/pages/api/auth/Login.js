import Link from "next/link";

export default async function handler(req, res) {
  let encodedClientID = encodeURIComponent(process.env.SPOTIFY_CLIENT_ID);
  let encodedScope = encodeURIComponent(
    "user-read-currently-playing user-modify-playback-state user-read-playback-state user-library-modify user-library-read playlist-modify-private playlist-modify-public"
  );
  let encodedRedirect = encodeURIComponent(
    `https://hello-world-bobtabrizi.vercel.app/`
  );
  let url = `https://accounts.spotify.com/authorize?response_type=code&client_id=${encodedClientID}&scope=${encodedScope}&redirect_uri=${encodedRedirect}&show_dialog=true`;

  res.redirect(url);
}
