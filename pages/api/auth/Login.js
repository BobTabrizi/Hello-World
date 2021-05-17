import Link from "next/link";

export default async function handler(req, res) {
  let encodedClientID = encodeURIComponent(process.env.SPOTIFY_CLIENT_ID);
  let encodedScope = encodeURIComponent(
    "user-read-currently-playing user-modify-playback-state user-read-playback-state user-library-modify user-library-read"
  );
  let encodedRedirect = encodeURIComponent(`http://localhost:3000/`);
  let url = `https://accounts.spotify.com/authorize?response_type=token&client_id=${encodedClientID}&scope=${encodedScope}&redirect_uri=${encodedRedirect}&show_dialog=true`;

  res.redirect(url);
}
