import Link from "next/link";
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpotify } from "@fortawesome/free-brands-svg-icons";
export default function AuthHelper(props) {
  const [token, setToken] = useState("");

  useEffect(() => {
    if (localStorage.getItem("Token") !== "undefined") {
      let tempToken = localStorage.getItem("Token");
      setToken(tempToken);
    }
    if (localStorage.getItem("Token") === "undefined") {
      localStorage.setItem("Token", token);
    }
    if (localStorage.getItem("Token") === null) {
      setToken("");
    }
  });
  if (token.length > 1) {
    return <div>Signed In</div>;
  } else {
    return (
      <Link href="/api/auth/Login">
        <div
          className="spotifySignIn"
          style={{ fontSize: 18, textAlign: "center" }}
        >
          <FontAwesomeIcon
            icon={faSpotify}
            style={{
              marginRight: 10,
              color: "#1DB954",
              verticalAlign: "middle",
            }}
            size="2x"
          ></FontAwesomeIcon>
          Sign In With Spotify
        </div>
      </Link>
    );
  }
}
