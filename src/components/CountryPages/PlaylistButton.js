import React, { useState } from "react";
import Link from "next/link";
export default function PlaylistButton(props) {
  return (
    <div style={{ cursor: "pointer" }}>
      <Link
        href={`/playlist/${props.countryID}?genre=${props.genre}&query=country`}
      >
        <img
          src={props.image}
          alt="Playlist Image"
          style={{ width: "400px", height: "300px" }}
        ></img>
      </Link>
    </div>
  );
}
